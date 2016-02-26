Router.map(function() {
	this.route('MapCountry', {path: '/step=country', controller: 'MapController',
		data: function() {
			var result = MapController.prototype.data.call(this);
			result.longTrips = true;
			result.visible = {
				page: Router.routes['TripAddForm'].path(),
				nextStep: {step: 'EditTrip'},
				hideFromAddress: "display: none",
				hideTime: "display: none"
			}
			return result
		}
	});
	this.route('EditTrip', {path: '/step=editTrip',	controller: 'MapController',
		data: function() {
			var result = MapController.prototype.data.call(this);
			result.visible = {
				page: Router.routes['TripAddForm'].path(),
				nextStep: {step: 'TripAddForm'},
				doShowDate: Router.routes['TripAddForm'].path({}, {query:{step: 'l1_2'}}),
			}
			return result
		}
	});
});


mapWorkflow = {
	getPath: function(route, params, query, trip) {
		da(['0.1.4'], "Getting url with loc in the query:"+route, query);
		if(trip && trip.toLatLng) {
			query.locToLng = trip.toLatLng.lng();
			query.locToLat = trip.toLatLng.lat();
		}
		if(trip && trip.fromLatLng) {
			query.locFromLng = trip.fromLatLng.lng();
			query.locFromLat = trip.fromLatLng.lat();
		}
		//var result = Router.routes[route].path(params, {query:query});
		var result = Router.routes[route].path(params);

		queryString = encodeUriQuery(query);
		if (queryString && queryString.length) {
			result = result + '?' + queryString;
		}
		da(['long-trips'], "Creating map url:"+result, params);
		return result;
	}
}

Meteor.startup(function () {
	updateDeviceSize();
    $(window).resize(updateDeviceSize);
    function updateDeviceSize(evt) {
        Session.set("device-size", {
     	   width: $(window).width(),
     	   height: $(window).height()
        });
     }
});
