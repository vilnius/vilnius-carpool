
Template.notificationsPanel.events({
	'click .selectTrip': function (event, template) {
		da(['edit-trip'], "Trip selected:", _.omit(this, ['_deps', 'path']));
		//trip.setFromLatLng(this.getFromLatLng);
		_.extend(currentTrip, _.omit(this, ['_deps']));
		//currentTrip._id = this._id;
		currentTrip.setALoc(this.fromLoc);
		currentTrip.setBLoc(this.toLoc);
	},
});

Template.myMapTrip.helpers({
	userText: function() {
		var user = Meteor.users.findOne(this.userId);
		//d("Formating ", user);
		return getUserName(user);
	},
	ownTripRequests: function() {
		//d("For the trip owner return unfiltered requests:"+Meteor.userId(),this);
		if(Meteor.userId() == this.owner) {
			return this.requests;
		}
	},
	ownRequests: function() {
		//("For others return only own request:",this);
		var userId = Meteor.userId();
		if(userId != this.owner) {
			return _.filter(this.requests, function(item) {
				return item.userId = userId;
			});
		}
	}
});

Template.myMapTrip.events({
	'click .confirm': function (event, template) {
    	Meteor.call('confirmTrip', {tripId: template.data._id, userId:this.userId}, function (error, result) {});
	}
	, 'click .removeTrip': function (event, template) {
		d("Removing:",this._id);
		Meteor.call('removeTrip', this._id, function (error, result) {});
	}
	, 'click .invite': function (event, template) {
		//d("Event invite:"+template.find("#inviteField"), template.data);
		tripClient.inviteForTrip(template.data._id, template.find("#inviteField-"+this._id).value, function (error, result) {});
	}
	, 'click .removeInvitee': function (event, template) {
		//d("Remove invite:", [template.data._id, this]);
		tripClient.removeInvitation(this.id);
	}
	, 'click .acceptRequest': function (event, template) {
		d("Accept Request:", [template.data._id, this]);
		tripClient.respondAskToJoin(this.id, "accept");
	}
	, 'click .rejectRequest': function (event, template) {
		//d("Accept Request:", [template.data._id, this]);
		tripClient.respondAskToJoin(this.id, "reject");
	}
	, 'click .cancelRequest': function (event, template) {
		//d("Cancel Request:", [template.data._id, this]);
		tripClient.removeInvitation(this.id);
	}
});
