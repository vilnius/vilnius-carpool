//console.log("Loading client/libs");

progress = {};
/*
 * TripClient is created to concentrate client logic in one place
 * and to be used by routers, templates
 */
TripBusinessLogic = function () {
	this.drawnOwnTrips = [];
	this.drawnActiveTrips = [];
};

TripBusinessLogic.createGroup = function () {
	return {
		owner: Meteor.userId(),
		groupId: getRandomString("ABCDEFGHIKLMNOPQRSTUVWXY0123456789", 5),
		invitees: []
	};
};

TripBusinessLogic.saveGroup = function (_id, formData, cb) {
	var group = Groups.findOne({_id:_id});
	var newMembers = _.without(formData.invitees, group && group.invitees);
	//d("New members:", [newMembers, formData.invitees], ['group-editing']);
	for(i in newMembers) {
		Meteor.call('inviteToGroup', group, newMembers[i]);
	}
	d("Saving group:"+_id, formData, ['group-editing']);
	/*
	Groups.update(
		{_id:_id},
		formData,
		{upsert: true});
	*/
	if(group) {
		//d("Updating group:"+_id, formData, ['group-editing']);
		Groups.update({_id:_id},formData);
	} else {
		//d("Insert group:", formData, ['group-editing']);
		Groups.insert(formData, cb);
	}
}

TripBusinessLogic.updateGroupMembers = function (id, members, callback) {
	d("Updating group"+id,members);
	Groups.update({_id:id},
		{$set: {members: members}}
	);
};

TripBusinessLogic.removeGroup = function (_id) {
	//d("Remove group:"+this._id, ['group-editing']);
	Groups.remove({_id:this._id});

	//if(Meteor.user.profile && Meteor.user.profile.defaultGroup)
}

TripBusinessLogic.enrollGroup = function (id, callback) {
	//d("Enrolling into group",id);
	Groups.update({_id:id},
		{$push: {members: Meteor.userId()}});
};

TripBusinessLogic.prototype.getMyGroups = function() {
	return Groups.find({$or:[
	    {owner:Meteor.userId()},
	    {members: Meteor.userId()}
	]})
}

TripBusinessLogic.getTrip = function(_id) {
	var trip = Trips.findOne({_id:_id});
	//da(['trip-view'], "Loading data for "+_id, trip);
	if(trip) {
		var owner = Meteor.users.findOne(trip.owner);
		return _.extend(trip, {
			ownerName: getUserName(owner),
			isOwner: function() {return trip.owner == Meteor.userId();	}
		});
	}
}

TripBusinessLogic.prototype.getActiveTrips = function() {
	// cannot bind as trips are in model.js wich is loaded later
	return CityTripWorker.prototype.getActiveTrips.call(this, Trips);
}

getActiveTrips = function() {
	var self = this;
	da(['async-capsule','active-trips'], "Getting Active trips "+Meteor.userId()+"@");
	var now = new Date();
	//var fromTime = new Date(now.getTime()-1000*60*60*3);
	var fromTime = new Date(now.getTime()-1000*60*60*24);

	while(self.drawnActiveTrips.length > 0) {
		var drawn = self.drawnActiveTrips.pop();
		drawn.line.setMap(null);
		for(p in drawn.points) {
			drawn.points[p].setMap(null);
		}
	}

	//var selectedTrip = Session.get("selectedTrip") || {};
	var selectedTrip = currentTrip._id;
	//d("Before trips load trip dependent", trip._deps.toAddress.hasDependents());
	var trips = Trips.find({
		owner:{$ne: Meteor.userId()},
		time: {$gte: fromTime}
	}, {sort:{time: -1}}).map(function(item) {
		da(['async-capsule'], "Creating capsule for active trips:"+Meteor.userId()+"@", item);
		var tripCapsule = new Trip(item);
		var options = {
			strokeColor: 'Grey',
		};
		if(selectedTrip == tripCapsule._id) {
			options = {
				strokeColor: 'OrangeRed',
			    strokeOpacity: 0.8
			}
		}
		mapController.drawActiveTrip(tripCapsule, options,  function(error, drawnTrip) {
			//da(["viewport-map"],"Save drawn own trip:"+drawnTrip);
			drawnTrip && self.drawnActiveTrips.push(drawnTrip);
		})
		return tripCapsule;
	});
	mapController.zoomForTrips(trips);
	return trips;
};

TripBusinessLogic.prototype.getOwnTrips = function() {
	var self = this;
	var now = new Date();
	//var fromTime = new Date(now.getTime()-1000*60*60);
	var fromTime = new Date(now.getTime()-1000*60*60*24);

	da(["trips-drawing"],"Remove drawn own trips:"+self.drawnOwnTrips.length);
	while(self.drawnOwnTrips.length > 0) {
		var drawn = self.drawnOwnTrips.pop();
		drawn.line.setMap(null);
		for(p in drawn.points) {
			drawn.points[p].setMap(null);
		}
	}

	var userId = Meteor.userId() || "";
	//var selectedTrip = Session.get("selectedTrip") || {};
	var selectedTrip = currentTrip && currentTrip._id;
	//d("Own trips:", userId);
	return Trips.find({
		$or : [{owner: userId},
	         {"requests.userId": userId}],
	    time: {$gte: fromTime}
	}, {sort:{time: -1}}).map(function(item) {
		//da(["async-capsule"], "Creating capsule in own trips:"+Meteor.userId()+"@",item);
		return new Trip(item).refetch(Trips, function(refetchedTrip) {
			//da(["viewport-map"],"After refetch draw trip:"+trip);
			var options = {}
			if(selectedTrip == refetchedTrip._id) {
				//d("Trip is selected:"+trip._id, selectedTrip);
				options = {
					strokeColor: 'OrangeRed',
					//strokeColor: 'RoyalBlue',
					//strokeColor: 'SteelBlue',
				    strokeOpacity: 0.8
				}
			}
			//da(["async-capsule"],"Draw own trip:"+refetchedTrip);
			mapComponent.drawActiveTrip(refetchedTrip, options,  function(error, drawnTrip) {
				//da(["trips-drawing"],"Save drawn own trip:"+drawnTrip);
				self.drawnOwnTrips.push(drawnTrip);
			})
		});
	});;
};

TripBusinessLogic.prototype.getFavoriteTrips = function() {
	if(trip.fromAddress) {
	//if(Session.get("currentAddress")) {
		var result = {};
		var userId = Meteor.userId() || "";
		//d("Get favorite trips for user:", userId);
		Trips.find({owner: userId }).forEach(function(item) {
			var index = item.toHouse+item.toStreet+item.toCity;
			//d("Indexing favorite trip:", index, ['favorite-trips']);
			if(result[index]) {
				//da(['async-capsule'], "Maybe toLoc is still missing");
				if(!result[index].toLoc) {
					result[index].toLoc = item.toLoc;
				}
				result[index].frequency++;
			} else {
				//d("Overwrite fromXxxx with current location"+trip);
				result[index] = _.extend(item, _(trip).pick('fromAddress', 'fromLatLng'));
				//result[index] = _.extend(item, mapGoogleAddress('from',Session.get("currentAddress")));
				result[index].frequency = 0;
			}
			//d("Unique for "+index,result[index]);
		});
		//d("Favorites result:",result,['favorite-trips']);
		return _.values(_.sortBy(result, function(item) {
			return -item.frequency;
		})).slice(0,3);
	}
}

TripBusinessLogic.saveTrip = function(query, callback) {
	// TODO deprecated for Trip Class use
	if(!query.tripTime) {
		query.time = query.time.length == 4 ? '0'+query.time:query.time;
		var tzo = new Date().getTimezoneOffset();
		var sign = tzo >= 0 ? '-' : '+';
		query.tripTime = new Date(
				query.date+'T'
				+query.time
				+sign + pad(tzo / 60)
		        + pad(tzo % 60));
	}

	var startTime = new Date().getTime();
	Meteor.call('saveTrip', query, function (error, result) {
		callback(error, result);
		ga('send', {
			  'hitType': 'event',          // Required.
			  'eventCategory': 'mvp',   // Required.
			  'eventAction': 'trip-added-'+query.role,      // Required.
			  'eventLabel': 'completed',
			  'eventValue': 4
		});

		var endTime = new Date().getTime();
		var timeSpent = endTime - startTime;
		ga('send', {
			  'hitType': 'timing',
			  'timingCategory': 'Meteor',
			  'timingVar': 'Method call',
			  'timingValue': timeSpent,
			  'timingLabel': 'save-trip',
		});
	});
};

function pad(num) {
    norm = Math.abs(Math.floor(num));
    return (norm < 10 ? '0' : '') + norm;
}


TripBusinessLogic.prototype.inviteForTrip = function(tripId, invitee) {
	//d("Inviting to join trip:"+tripId);
	Meteor.call('inviteForTrip', tripId, invitee, function (error, result) {
		if(error) d("inviteForTrip call error", error);
	});
};

TripBusinessLogic.prototype.invitationAccept = function(tripId, response, callback) {
	//d("Accepting invitation for trip:"+tripId);
	Meteor.call('invitationAccept', tripId, response, function (error, result) {
		if(error) {
			d("invitationAccept call error", error);
		} else {
			callback && callback(result);
		}
	});
};

TripBusinessLogic.prototype.removeInvitation = function(tripId, callback) {
	//d("Removing invitation for trip:"+tripId);
	Meteor.call('removeInvitation', tripId, function (error, result) {
		if(error) {
			d("removeInvitation call error", error);
		} else {
			callback && callback(result);
		}
	});
};

TripBusinessLogic.prototype.askToJoin = function(tripId) {
	//d("Asking to join trip:"+tripId);
	Meteor.call('askToJoin', tripId, function (error, result) {
		if(error) d("askToJoin call error", error);
	});
};

TripBusinessLogic.prototype.respondAskToJoin = function(invitationId, response, callback) {
	//d("Removing invitation for trip:"+tripId);
	Meteor.call('respondAskToJoin', invitationId, response, function (error, result) {
		if(error) {
			d("respondAskToJoin call error", error);
		} else {
			callback && callback(result);
		}
	});
};

TripBusinessLogic.prototype.resetActionProgress = function() {
	progress = {};
	NProgress.done();
}

TripBusinessLogic.prototype.setActionProgress = function(action, value) {
	if(value == 100) {
		delete progress[action];
	} else {
		progress[action] = value;
	}
	var sum = 0;
	var total = 0;
	_.each(progress, function(item) {sum+=item;total+=100;});
	//da(['ie8-router', 'group-security'], "Progress:"+sum+"/"+total+" of "+action+"="+value, progress);
	if(sum == 0) {
		if(total == 0) {
			NProgress.done();
		} else {
			NProgress.start();
		}
	} else {
		NProgress.set(sum/total);
	}
};
