const version = "0.1.14"
const tag = "160713.1"

Accounts.config({
    loginExpirationInDays: 90
});

Meteor.methods({
	inviteToGroup: function(group, member) {
		var emailText = "Join the group "
			+group.title+" clicking on the link\n"
			+Meteor.absoluteUrl("e/"+group.groupId);
		Email.send({
			from: "marius@nerk.lt",
		    to: member,
		    subject: "Invitation to join trips sharing group",
		    text:emailText
		});
	},

	saveTrip : function(options) {
		//da(['INFO'], "Save trip called:", options);
		if(options._id) {
			var trip = _(options).omit(['_id']);
			Trips.update({_id: options._id},{$set:trip});
			da(['INFO','viewport-map'], "Updated trip:",options);
			//da(['INFO','viewport-map'], "Updated trip in DB:", Trips.findOne({_id: options._id}));
		} else {
			options.owner = this.userId;
			options.requests = [];
			var tripId = Trips.insert(options);
			da(['viewport-map'], "Saved trip:"+tripId, options);
			options._id = tripId;
			userNotifier.notify('tripCreated', {trip: options});
			return tripId;
		}
	},

	inviteForTrip: function(tripId, invitee) {
		var trip = Trips.findOne({_id: tripId});
		var invitationId = getRandomString("ABCDEFGHIKLMNOPQRSTUVWXY0123456789", 5);
		d("Inviting for a trip:"+tripId, [trip, {
			//from: "spastai@gmail.com",
			from: "marius@nerk.lt",
		    to: invitee
		}]);
		var emailText = "Join the trip "
				+trip.fromStreet+" "+trip.fromHouse+"-"
				+trip.toStreet+" "+trip.toHouse+"\n"
				//+"http://localhost:3000/accept?"+trip._id+"&one"+"\n"
				+Meteor.absoluteUrl("trip/"+invitationId+"/accept");
				+Meteor.absoluteUrl("trip/"+invitationId+"/reject")+"\n";
		Email.send({
				//from: "spastai@gmail.com",
				from: "marius@nerk.lt",
			    to: invitee,
			    subject: "Trip invitation",
			    text:emailText
		});
		Trips.update(
			{_id: tripId},
			{$addToSet: {requests: {
				proposed: true,
				userEmail: invitee,
				id: invitationId
		}}});
	},

	invitationAccept: function(invitationId, response) {
		var user = Meteor.user();
		//d(response+" invitation for trip:"+tripId+" user:",user);

		var trip = Trips.findOne({"requests.id":invitationId});
		var tripOwner = Meteor.users.findOne(trip.owner);
		d("Responding to invitation to trip owner:"+response, tripOwner);
		var inviter = getUserEmail(tripOwner);
		var request = _.find(trip.requests, function(item) {
			return item.id == invitationId;
		});

		var emailText = "Proposal to join the trip "
			+trip.fromStreet+" "+trip.fromHouse+"-"
			+trip.toStreet+" "+trip.toHouse+"\n"
			+"was accepted by "+request.userEmail;

		Email.send({
			from: request.userEmail || "spastai@gmail.com",
			to: inviter,
			subject: "Trip invitation accepted",
			text:emailText
		});

		Trips.update(
			{"requests.id":invitationId},
			{$set: {"requests.$.response": response }}
		);
	},

	removeInvitation: function(invitationId) {
		Trips.update({},
			{$pull:{"requests":{"id":invitationId}}}
		);
	},

	askToJoin : function(tripId) {
		var user = Meteor.user();
		var requestor = getUserEmail(user);
		d("Asking to join trip:"+requestor,tripId)
		var trip = Trips.findOne(tripId);
		var tripOwner = Meteor.users.findOne(trip.owner);
		var requestId = getRandomString("ABCDEFGHIKLMNOPQRSTUVWXY0123456789", 5);

		var emailText = "User "+requestor
			+" wants to join the trip\n"
			+trip.fromStreet+" "+trip.fromHouse+"-"
			+trip.toStreet+" "+trip.toHouse+"\n";

		Email.send({
			from: requestor || "spastai@gmail.com",
			to: getUserEmail(tripOwner),
			subject: "Asking to join the trip",
			text:emailText
		});

		Trips.update(
			{_id: tripId},
			{$addToSet: {requests: {
				userId: this.userId,
				id: requestId,
				asked: true
			}}}
		);
		// console.log("Trip "+options.tripId+" requested");
	}

	, respondAskToJoin: function(invitationId, response) {
		d("Responding asking to join trip:"+response, invitationId)
		Trips.update(
			{"requests.id":invitationId},
			{$set: {"requests.$.response": response }}
		);
	}

	, confirmTrip : function(options) {
		Trips.update(
			{_id:options.tripId, "requests.userId":options.userId},
			{$set: {"requests.$.confirmed": true}}
		);
	}
	, typeaheadCity : function(options) {
		var result = [];
		Streets.find({name:new RegExp(options.query,"i")}, {limit:5}).forEach(function(e,i) {
			result.push(e.name);
		});
		da(['typeahead'],"Typeahead city:"+options.query, result);
		return result;
	},

	lookupStreet : function(options) {
		var result = [];
		/*
		Streets.find({
			street: {$regex: new RegExp(options.query), $options: 'i'},
			city: options.city
		},
		{limit: 8}).map(function(item){
			result.push(item.street);
		});
		*/
		var result = findDistinct(Streets, {
			street: {$regex: new RegExp(options.query), $options: 'i'},
			city: options.city
		}, "street", 8);
		//d("Lookup street:"+options.query, result);
		return result;
	},

	transformStreets: function(options) {
		d("Transform streets");

		Streets.find({}).forEach(function(street) {
			var city = CityStreets.findOne({name: street.city});
			console.log("City:"+city);
			if(city) {
				CityStreets.update(
					{name: street.city},
					{$addToSet: {streets: {name: street.street}}},
					function(err) {
						console.log("Error:"+err);
					});
			} else {
				CityStreets.insert(
					{name: street.city, streets: [{name: street.street}]}
				);
			}
		});
		return;
	}
	, mock: function(options) {
		d("Mock called");
	}
});

/*
Meteor.onConnection(function(connection){
	da(['data-publish'],"Client connected:"+connection.id);
});
*/

d("Tmh Server started. Version "+version+".SNAPSHOT-"+tag+" on "+Meteor.settings.public.environment);
