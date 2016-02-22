var map = null;

streetsMap = null;

fromMarker = null;
toMarker = null;
searchToCircle = null;
searchFromCircle = null;
wruMarker = {};

MapBridge = function () {
	var self = this;
	//da(['viewport-map'], "Creating MapBridge steam");
	this.steam = new Steam(this);
	this.steam.run(this._loadGoogle, function() {
		// After google libraries loaded
		self.createLatLng = self._createLatLng;
	});

	// To slow down requests towards google stub is created
	this.geocoder = new Geocoder();
	this.directions = new Directions();

	this.steam.run(this._initServices, function() {
		// After gmap services loaded
		//self.getAddressLatLng = self._getAddressLatLng
		//self.getLatLngAddress = self._getLatLngAddress

		// start actual processing
		this.geocoder.init(new google.maps.Geocoder());
	    this.directions.init(new google.maps.DirectionsService());
	});

	// To collect the tasks to be run after map is initialized
	this.mapSteam = new Steam(this);
};

MapBridge.prototype._loadGoogle = function (cb) {
	this.s = 'ok';
	da(['mapbridge-init'], "Loading google");
	google.load("maps", "3", {other_params: "libraries=geometry,places", callback: cb});
};

MapBridge.prototype._initServices = function (cb) {
	da(['mapbridge-init', '0.1.4'], "Init services:"+this.s);

  var polylineOptionsActual = new google.maps.Polyline({
  	//strokeColor: '#BABA9A',
      strokeColor: '#B8B945',
      strokeOpacity: 0.8,
      strokeWeight: 6
  });
  this.directionsDisplay = new google.maps.DirectionsRenderer({
  	suppressMarkers: true,
  	//polylineOptions: polylineOptionsActual
  });

  cb && cb(null, google);
};

MapBridge.prototype.initMap = function (div) {
	var self = this;
	this.steam.run.bind(this)(this._initMap.bind(this,div), function() {
		da(['mapbridge-init'], "Init map done");
		self.runAfterMapInit = self._runAfterMapInit;
		self.drawActiveTrip = self._drawActiveTrip;
		self.mapSteam.run();
	});
}

MapBridge.prototype.runAfterMapInit = function(fn, cb) {
	this.mapSteam.push(fn, cb);
}

MapBridge.prototype._runAfterMapInit = function(fn, cb) {
	fn.call(this, cb);
}

MapBridge.prototype._initMap = function (div, cb) {
	//da(['viewport-map'], "Init map:"+this.s);
	var self = this;
	if(!div) return;
	if($(div).attr('MapBridge') == 'ready') {
		//da(['viewport-map'],"MapBridge already initialized on this div");
		cb && cb(null,null);
		return;
	}

	var myOptions = {
		zoom : 12,
		center : new google.maps.LatLng(54.682106,25.280685),
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	streetsMap = new google.maps.Map(div, myOptions);
	google.maps.event.addListenerOnce(streetsMap, 'idle', function() {
		$(div).attr('MapBridge', 'ready')
		//da(['viewport-map'],"Street map created.");
	});

	var trafficLayer = new google.maps.TrafficLayer();
	trafficLayer.setMap(streetsMap);
    this.directionsDisplay.setMap(streetsMap);

    //d("Droping from marker, because some mystic in initialization");
    fromMarker && fromMarker.setMap(streetsMap);
    toMarker && toMarker.setMap(streetsMap);
    searchToCircle && searchToCircle.setMap(streetsMap);
    searchFromCircle && searchFromCircle.setMap(streetsMap);

    google.maps.event.addListener(streetsMap, 'click', function(event) {
    	self.dropToMarker(event.latLng);
    	trip.setToLatLng(event.latLng);

 		mapController.getLatLngAddress(event.latLng, function(err, address) {
 			Session.set("toAddress", address);
 		});
    });
    cb && cb(null,null);
};

MapBridge.prototype.createLatLng = function (loc, cb) {
	this.steam.run(this._createLatLng.bind(this, loc), cb);
};

MapBridge.prototype._createLatLng = function (loc, cb) {
	if(loc) {
		cb && cb(null,new google.maps.LatLng(loc[1],loc[0]));
	} else {
		cb && cb(null,null);
	}
};

MapBridge.prototype.addAutomcomplete = function (input, cb) {
	//d("Adding autocomplete to:"+input)
	var autocomplete = new google.maps.places.Autocomplete(input);
	autocomplete.bindTo('bounds', streetsMap);

	google.maps.event.addListener(autocomplete, 'place_changed', function() {
		var place = autocomplete.getPlace();
		if (!place.geometry) {
		  cb($(input).val());
		}
		var address = '';
		if (place.address_components) {
		  address = [
		    (place.address_components[0] && place.address_components[0].short_name || ''),
		    (place.address_components[1] && place.address_components[1].short_name || ''),
		    (place.address_components[2] && place.address_components[2].short_name || '')
		  ].join(' ');
		  cb($(input).val(), place, address);
		} else {
		  cb($(input).val(), place);
		}
	});
}

MapBridge.prototype.getCurrentLocation = function (callback) {
	var self = this;
	//da(['long-trips'], "Getting current location");
	if ("geolocation" in navigator) {
		//d("Geolocation is available");
		navigator.geolocation.getCurrentPosition(function(location) {
			//d("Geolocation:", location);
			var latlng = new google.maps.LatLng(location.coords.latitude,location.coords.longitude);
    	    callback(null, latlng)
		});
	}
};

MapBridge.prototype.watchPosition = function(cb) {
	this.runAfterMapInit(this._watchPosition.bind(this), cb);
}

MapBridge.prototype._watchPosition = function (callback) {
	if ("geolocation" in navigator) {
		//d("Geolocation is available");
		navigator.geolocation.watchPosition(function(location) {
			var crd = location.coords;
			//d("Geolocation:", location);
			var latlng = new google.maps.LatLng(crd.latitude,crd.longitude);
    	    callback(null, {latlng:latlng,acc: crd.accuracy})
		});
	}
}

MapBridge.prototype.showMap = function () {
	Session.set("isMapVisible", true);
	google.maps.event.trigger(streetsMap, 'resize');
	/*
	$(window).resize(function() {
		d("Map resize happened");
		var h = $(window).height(), offsetTop = 80; // Calculate the top offset
		$('#streets_map_canvas').css('height', (h - offsetTop));
	}).resize();
	*/
}

MapBridge.prototype.zoomForTrips = function (trips) {
	this.runAfterMapInit(this._zoomForTrips.bind(this, trips));
}

MapBridge.prototype._zoomForTrips = function (trips, cb) {
	//da(['long-trips'], "Create a new viewpoint bound:", trips.length);
	if(trips.length == 0) return cb && cb(null, trips);
	var bounds = new google.maps.LatLngBounds();
	var anyLocs = false;
	for(i in trips) {
		var trip = trips[i];
		//da(['long-trips'], "Go through each..."+trip);
		trip.fromLatLng && bounds.extend (trip.fromLatLng);
		trip.toLatLng && bounds.extend (trip.toLatLng);
		if(trip.fromLatLng || trip.toLatLng) {
			anyLocs = true;
		}
	}
	//  Fit these bounds to the map
	anyLocs && streetsMap.fitBounds (bounds);
	cb && cb(null, trips);
}

/**
 * @Deprecated logic moved to TripBusinessLogic.prototype.getOwnTrips and
 * TripBusinessLogic.prototype.getActiveTrips
 * TODO move bounds setting logic somewhere
 */
MapBridge.prototype.showTrip = function (trip) {
	var self = this;
	this.showMap();

	var fromLatLng = new google.maps.LatLng(trip.fromLoc[1],trip.fromLoc[0]);
	var toLatLng = trip.toLoc && new google.maps.LatLng(trip.toLoc[1],trip.toLoc[0]);
	this.dropFromMarker(fromLatLng);
	trip.toLoc && this.dropToMarker(toLatLng);

	//  Create a new viewpoint bound
	var bounds = new google.maps.LatLngBounds ();
	//  Go through each...
	bounds.extend (fromLatLng);
	trip.toLoc && bounds.extend (toLatLng);
	//  Fit these bounds to the map
	streetsMap.fitBounds (bounds);

	self.drawnSelectedTrip && self.drawnSelectedTrip.line.setMap(null);
	if(trip.path) {
		this.drawActiveTrip(trip, {
			strokeColor: 'DodgerBlue',
		    strokeOpacity: 0.5}, function(err, result) {
		    	self.drawnSelectedTrip = result;
		    }
		)
	} else {
		// TODO: deprecated, but check maybe this needed do async tasks
		var request = {
		  origin: fromLatLng,
		  destination: toLatLng,
		  travelMode: google.maps.TravelMode['DRIVING']
		};
		this.directionsService.route(request, function(response, status) {
		    if (status == google.maps.DirectionsStatus.OK) {
		    	self.directionsDisplay.setDirections(response);
		    }
		});
	}
}

MapBridge.prototype.getTripPath = function (trip, cb) {
	var result = {};
	da(['async-capsule', 'map-bridge'], "Calculating path for:"+trip);
	var request = {
      travelMode: google.maps.TravelMode['rider' == trip.role ? 'TRANSIT' : 'DRIVING']
	};
	if(trip.fromLoc && trip.toLoc) {
		request.origin = new google.maps.LatLng(trip.fromLoc[1],trip.fromLoc[0]);
		request.destination = new google.maps.LatLng(trip.toLoc[1],trip.toLoc[0]);
		//da(['map-bridge'], "Created request from locs:",request);
	} else 	if(trip.fromLatLng && trip.toLatLng) {
		request.origin = trip.fromLatLng;
		request.destination = trip.toLatLng;
		//da(['map-bridge'], "Created request from latlng:",request);
	} else {
		//da(['map-bridge'], "No locations found for:"+trip);
		return cb && cb("No locations found for:"+trip, null)
	}

	//da(['map-bridge', 'get-path'], "Getting path:"+trip);
	this.directions.route(request, function(error, result) {
		//da(['map-bridge', 'get-path'], "Directions returned:"+trip, result);
		if (!error) {
			var encodedPoints = result.routes[0].overview_polyline;
			//da(['map-bridge', 'async-capsule', 'get-path'], "Encoded path:"+encodedPoints, request);
			cb & cb(null, encodedPoints);
		} else {
			//da(['get-path'], "Get path didn't encoded path", error);
		}
	});
};

MapBridge.prototype.drawActiveTrip = function (trip, options, cb) {
	this.runAfterMapInit(this._drawActiveTrip.bind(this, trip, options), cb);
}

MapBridge.prototype._drawActiveTrip = function (trip, options, cb) {
	if(!streetsMap) return;
	//d("Drawing trip:",trip.path);
	var result =  {
		points: []
	};

	if(trip.path && trip.toLoc && trip.fromLoc) {
		da(['async-capsule', 'trips-drawing'], "Drawing trip path:"+trip);
		var decodedPoints =	google.maps.geometry.encoding.decodePath(trip.path);
		var fromLatLng = new google.maps.LatLng(trip.fromLoc[1],trip.fromLoc[0]);
		var toLatLng = trip.toLoc && new google.maps.LatLng(trip.toLoc[1],trip.toLoc[0]);

		//d("Decoded points:", decodedPoints);
		result.line = new google.maps.Polyline(_.extend({
			clickable: true,
			map:streetsMap,
			path: decodedPoints,
			//strokeColor: '#0000FF',
			strokeColor: 'SteelBlue',
		    strokeOpacity: 0.5,
		    strokeWeight: 3}, options));
		result.points[0] = new google.maps.Marker({
    		map: streetsMap,
				position: fromLatLng,
            draggable:false,
            icon: new google.maps.MarkerImage(
	    				"/img/red-dot-small.png",
		    			new google.maps.Size(9, 9),
		        	new google.maps.Point(0,0),
		        	new google.maps.Point(0, 0))
		});
		result.points[1] = new google.maps.Marker({
    		map: streetsMap,
				position: toLatLng,
            draggable:false,
            icon: new google.maps.MarkerImage(
	    				"/img/green-dot-small.png",
		    			new google.maps.Size(9, 9),
		        	new google.maps.Point(0,0),
		        	new google.maps.Point(5, 5))
		});
		cb && cb(null, result);
	} else {
		da(['async-capsule', 'veiwport-map'], "Can't draw - path is not decoded: "+trip);
		cb && cb(null, null);
	}
	//return result;
}

MapBridge.prototype.setFromAddress = function(house, street, city, callback) {
	var self = this;
	if(arguments.length > 2) {
		this.getAddressLatLng(house, street, city, function(err, location) {
			streetsMap.setCenter(location);
			self.dropFromMarker(location);
			callback && callback(location);
		});
	} else {
		callback = street;
		this.getAddressLatLng(house, function(err, location) {
			streetsMap.setCenter(location);
			self.dropFromMarker(location);
			callback && callback(location);
		});

	}
}

MapBridge.prototype.setToAddress = function(house, street, city, callback) {
	var self = this;
	//d("Focus out query:"+toAddress, query);
	if(arguments.length > 2) {
		this.getAddressLatLng(house, street, city, function(err, location) {
			// Call for full address
			streetsMap.setCenter(location);
			self.dropToMarker(location);
			callback && callback(location);
		});
	} else {
		address = house;
		callback = street;
		this.getAddressLatLng(address, function(err, location) {
			// Call for city only
			streetsMap.setCenter(location);
			self.dropToMarker(location);
			callback && callback(location);
		});
	}
}

MapBridge.prototype.getLatLngAddress = function(latlng, cb) {
	if(!latlng) {
		e("No latlng provided for getLatLngAddress")
		return;
	}
	//da(['long-trips'],"GetLatLngAddress begin:", latlng);
    this.geocoder.geocode({'latLng': latlng}, function(error, results) {
      if (!error && results.length > 0) {
    	  //da(['long-trips'],"Geocoder returned address for:" + latlng, results);
    	  var address = {};
    	  for(l in results[0].address_components) {
    		  var addressLine = results[0].address_components[l];
    		  address[addressLine.types[0]] = addressLine.short_name;
    	  }
     	  //da(['long-trips', 'queues'],"Got Address from latlng:", address);
    	  cb && cb(null, address);
      } else {
    	  //d("Failed latlng:"+latlng, status);
    	  //da(['long-trips', 'queues'],"Geocoder returned no result getting address:" + latlng, error);
    	  cb && cb(error, null)
      }
    });
};

MapBridge.prototype.getAddressLatLng = function() {
	var self = this;

	var house, street, city, cb;
	var args = [].slice.call(arguments);
	var address;
	if (typeof(_(args).last()) == "function") {
		cb = args.pop();
	}
	//da(['TH-01'],"Args:", args);
	if(3 == args.length) {
	  address = args[1]+" "+args[0]+","+args[2];
	} else if(2 == args.length) {
	  address = args[0]+","+args[1]
	} else {
	  address = args[0];
	}

	//da(['async-capsule', '0.1.4', 'queues'], "Get latlng from address:"+address, [].slice.call(arguments));
	this.geocoder.geocode({ 'address': address}, function(error, result) {
		if(!error && result.length > 0) {
			cb && cb(null, result[0].geometry.location);
		} else {
			cb && cb(error, null);
		}
	});
};

MapBridge.prototype.setFromLatLng = function(latlng) {
	Session.set("fromLngLat", [latlng.lng(), latlng.lat()])
	streetsMap.setCenter(latlng);
	this.dropFromMarker(latlng);
};

MapBridge.prototype.setSearchToAddress = function(house, street, city, callback) {
	var self = this;
	this.getAddressLatLng(house, street, city, function(err, location) {
		streetsMap.setCenter(location);
		self.dropSearchToMarker(location);
		callback && callback(location);
	});
}

MapBridge.prototype.setSearchToMarkerRadius = function(radius) {
	searchToCircle && searchToCircle.setRadius(radius);
}

MapBridge.prototype.setSearchFromAddress = function(house, street, city, callback) {
	var self = this;
	this.getAddressLatLng(house, street, city, function(err, location) {
		self.setSearchFromLatLng(location);
		callback && callback(location);
	});
};

MapBridge.prototype.setSearchFromLatLng = function(location) {
	streetsMap.setCenter(location);
	this.dropSearchFromMarker(location);
};

MapBridge.prototype.setSearchFromMarkerRadius = function(radius) {
	searchFromCircle && searchFromCircle.setRadius(radius);
}

MapBridge.prototype.dropFromMarker = function(location, cb) {
	//d("Droping From marker:", location);
	if(!fromMarker) {
		//d("Creating from marker");
	    var pinImage = new google.maps.MarkerImage(
    		"http://maps.google.com/mapfiles/ms/icons/red-dot.png",
    		//"http://chart.googleapis.com/chart?chst=d_simple_text_icon_left&chld=|14|000|wc-male|24|000|FFF",
	    	new google.maps.Size(30, 24),
	        new google.maps.Point(0,0),
	        new google.maps.Point(10, 24));
	 	fromMarker = new google.maps.Marker({
    		map: streetsMap,
			position: location,
            icon: pinImage,
            draggable:true
		});
	 	google.maps.event.addListener(fromMarker, 'dragend', function(event) {
	 		// TODO trips should be always present
	 		trip.setFromLatLng(event.latLng);
	 		mapController.getLatLngAddress(event.latLng, function(err, address) {
	 			Session.set("currentAddress", address);
	 		});
	 	});
	} else {
		fromMarker.setPosition(location);
	}
}

MapBridge.prototype.dropToMarker = function(location) {
	var self = this;
	//da(['DEBUG','viewport-map'],"Dropping to marker:", location, ['drop-pins']);
	Session.set("toLngLat", [location.lng(), location.lat()])
	if(!toMarker) {
	    var pinImage = new google.maps.MarkerImage(
    		//"http://chart.googleapis.com/chart?chst=d_simple_text_icon_left&chld=|14|000|home|24|000|FFF",
    		"http://maps.google.com/mapfiles/ms/icons/green-dot.png",
    		//"http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
	        //new google.maps.Size(21, 34),
	    	new google.maps.Size(32, 32),
	        new google.maps.Point(0,0),
	        new google.maps.Point(16, 32));
	 	toMarker = new google.maps.Marker({
    		map: streetsMap,
			position: location,
            icon: pinImage,
            draggable:true,
            //shadow: pinShadow
		});
	 	google.maps.event.addListener(toMarker, 'dragend', function(event) {
	 		//d("Updating to marker:", event.latLng, ['drop-pins']);
	 		trip.setToLatLng(event.latLng);

	 		// TODO deprecated
	 		Session.set("toLngLat", [event.latLng.lng(), event.latLng.lat()])
	 		mapController.getLatLngAddress(event.latLng, function(err, address) {
	 			Session.set("toAddress", address);
	 		});
	 	});
	} else {
		toMarker.setPosition(location);
	}
}

MapBridge.prototype.dropSearchToMarker = function(location) {
	//d("Droping search to marker:", location);
	if(!searchToCircle) {
		//d("Creating search to marker");
	    searchToCircle = new google.maps.Circle({
	        strokeColor: '#00FF00',
	        strokeOpacity: 0.8,
	        strokeWeight: 2,
	        fillColor: '#00FF00',
	        fillOpacity: 0.10,
	        map: streetsMap,
	        center: location,
	        radius: 750
	    })
	} else {
		searchToCircle.setCenter(location);
	}
}

MapBridge.prototype.dropSearchFromMarker = function(location) {
	//d("Droping search to marker:", location);
	if(!searchFromCircle) {
		//d("Creating search from marker");
	    searchFromCircle = new google.maps.Circle({
	        strokeColor: '#FF0000',
	        strokeOpacity: 0.8,
	        strokeWeight: 2,
	        fillColor: '#FF0000',
	        fillOpacity: 0.10,
	        map: streetsMap,
	        center: location,
	        radius: 750
	    })
	} else {
		searchFromCircle.setCenter(location);
	}
}

MapBridge.prototype.dropWruMarker = function(location, acc, cb) {
	if(!wruMarker.circle) {
		//d("Creating search to marker");
		wruMarker.circle = new google.maps.Circle({
	        strokeColor: '#00FF00',
	        strokeOpacity: 0.8,
	        strokeWeight: 2,
	        fillColor: '#00FF00',
	        fillOpacity: 0.10,
	        map: streetsMap,
	        center: location,
	        radius: acc
	    });
	} else {
		wruMarker.circle.setCenter(location);
		wruMarker.circle.setRadius(acc);
	}
	streetsMap.setCenter(location);
}

MapBridge.prototype.getTrip = function () {
	return trip;
}

MapBridge.prototype.setTrip = function (value) {
	trip = value;
}
