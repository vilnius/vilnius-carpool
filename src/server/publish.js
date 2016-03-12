Meteor.publish("userData", function () {
	//d("Publishing", this.userId);
	return Meteor.users.find(
		//{_id: this.userId},
		{}, {
			fields: {
				//'profile.name': true,
				'services.facebook.id': 1,
		}
	});
});

/*

Meteor.publish("userContacts", function () {
	da(['data-publish'],"Publish user contacts");
	d("Publish user contacts");

	return Meteor.users.find(
		//{_id: this.userId},
		{}, {
			fields: {
				'profile': true,
		}
	});
	var usersAsking = _(Trips.find({"owner" : "dQ7kQYH3abR6A7EBC", "requests.asked": true}).map(function(item) {
		return _.chain(item.requests).filter(function(request) {
			return request.asked == true;
		}).pluck("userId").value();
	})).flatten();
	d("Find the trips users owns and are asked:"+this.userId, usersAsking);
	var users = Meteor.users.find({$or:[
		{_id: this.userId},
		{_id: {$in: usersAsking}}
	]},{
		fields: {
//			'profile.phone': 1,
			_id: 1
		}
	});
	d("Users with numbers:", users.fetch());
	return users;
});
*/

Meteor.publish("groupMemberData", function () {
	var groupQuery = {$or: [
       	{members:this.userId},
   		{owner:this.userId}
   	]};
   	var groupsUsers = _(Groups.find(groupQuery).map(function(item){
   		//d("User belongs to", item);
   		return item.members;
   	})).flatten();
   	da(['data-publish'], "Groups users for:"+this.userId, groupsUsers);
	var users = Meteor.users.find({
		_id: {$in: groupsUsers}
	}, {
		fields: {
			'emails': true,
		}
	});
	da(['data-publish'],"Found users:", users.fetch());
	return users;
})

Meteor.publish("streets", function () {
	return Streets.find();
});

Meteor.publish("trip", function (id) {
	da(["edit-trip", 'viewport-map'], "Subscribing:", id);
	return Trips.find({_id:id});
});

/*
 * ownTrips returns more data
Meteor.publish("ownTrips", function (niceLink) {
	var self = this;
	if(!this.userId) {
		da(['data-publish'],"Do not block subscribtions for not logged in users");
		this.ready();
		return;
	}
	var groups = getAvailableGroups(niceLink, this.userId);
	var tripQuery = {$and:[
	  {$or: [{owner:self.userId}, {"requests.userId": self.userId}]},
	  {$or: [{group: {$in: groups}}, {group: {$exists: false}}]}
	]};
	da(['data-publish'],"Publishing ownTrips for:"+this.userId+"@"+niceLink, tripQuery);
	var result =  Trips.find(tripQuery);
	da(['data-publish'], "Found ownTrips :"+result.fetch().length);
	this.ready();
	//this.ready(); return; // for debuging
	return result;
});
*/

/*
Moved to carpool-service
Meteor.publish("activeTrips", function (niceLink, filter) {
	var groups = getAvailableGroups(niceLink, this.userId);
	da ['data-publish'], "Publish only public and user groups trips:"+niceLink, groups

	filteredTrips = getTripIdsFilteredByLoc(Trips, filter);
	var groupFilter = {
		$or:[{group: {$in: groups}},{group: {$exists: false}}]
	};
	//da(['data-publish', 'viewport-map'], "Active trips filter:", filter);
	var query = {}
	if(groups) {
		_.extend(query, groupFilter);
	}
	if(filter && (filter.fromLoc || filter.toLoc)) {
		_.extend(query, {_id : {$in: filteredTrips}});
	}
	da(['data-publish'], "Publish activeTrips:"+this.userId+"@"+niceLink, query);
	var result = Trips.find(query, {
		fields: { requests: 0}
	});
	self = this;
	Meteor.setTimeout(function() {
		da(['data-publish'], "Found activeTrips:"+result.fetch().length);
		self.ready();
	}, 5000)
	return result;
});
*/

getTripIdsFilteredByLoc = function(collection, filter) {
	var fromTrips = []
	if(filter && filter.fromLoc) {
		fromTrips = collection.find({fromLoc: filter.fromLoc},{
			fields: { requests: 0}
		}).fetch();
	}
	//da(['viewport-map'], "From trips:", fromTrips );
	var toTrips = [];
	if(filter && filter.toLoc) {
		toTrips = collection.find({toLoc: filter.toLoc},{
			fields: { requests: 0}
		}).fetch();
	}
	//da(['viewport-map'], "To trips:", toTrips );
	//d("Merge these arrays as mongo is not able to search by to geo indexes");
	var fromTripsIds = _.pluck(fromTrips, "_id");
	var toTripsIds = _.pluck(toTrips, "_id");
	//da(['viewport-map'], "To trips ids:", toTripsIds);

	var filteredTrips = toTripsIds;
	if(fromTripsIds.length>0 && toTripsIds.length>0) {
		filteredTrips = _.intersection(fromTripsIds, toTripsIds);
	} else if(fromTripsIds.length>0) {
		filteredTrips = fromTripsIds;
	}

	return filteredTrips;
}

function getAvailableGroups(niceLink, userId) {
	var groupQuery = {$or: [
	    {members:userId},
		{owner:userId}
	]};
	groupQuery.niceLink = niceLink;
	da(['data-publish'], "Select available for the user groups:", groupQuery);
	return Groups.find(groupQuery).map(function(item){
		//d("User belongs to", item);
		return item._id;
	});
}

Meteor.publish("groups", function () {
	// should be seen for new users also
	//logger.log('info', "Publishing groups for:"+this.userId);
	return Groups.find({});
	//return Groups.find({owner: this.userId});
});

Meteor.publish("meanings", function () {
	return Meanings.find();
});
