UserNotifier = function () {	
};

var events = {
	tripCreated: function(options) {
		var trip = options.trip;
		da(['trip-view'], trip);
		if(trip.group) {
			var group = Groups.findOne(trip.group);
			da(['trip-view'], "Send emails to all group", group.title);
			var tripOwner = Meteor.users.findOne(trip.owner);
			var creator = getUserEmail(tripOwner);
			var recipients = _.map(group.members, function(member) {
				return getUserEmail(Meteor.users.findOne(member));
			});
			var groupOwner = Meteor.users.findOne(group.owner);
			recipients.push(getUserEmail(groupOwner));
			da(['notifications-profile'],"Creator and recipients:"+creator, recipients);
			var user = Meteor.user();
			if(user.profile && user.profile.notifications && user.profile.notifications.muteOnOwnTripCreate) {
				recipients = _.without(recipients, creator); 
			}
			da(['notifications-profile'],"Check profile:"+ user._id, recipients);
			if(recipients.length > 0) {
				var emailText = getUserName(tripOwner)+" created trip "
					+trip.fromStreet+" "+trip.fromHouse+"-"
					+trip.toStreet+" "+trip.toHouse+"\n"
					//+"http://localhost:3000/trip?"+trip._id+"&one"+"\n";
					+Meteor.absoluteUrl("trip/view/"+trip._id);
				Email.send({
					//from: "spastai@gmail.com",
					from: creator,
				    to: recipients,
				    subject: getUserName(tripOwner)+" goes "+trip.toStreet+" "+trip.toHouse,
				    text:emailText 
				}); 			
			} else {
				da(['notifications-profile'],"No recipients:", group);
			}
		}
	}
}

UserNotifier.prototype.notify = function(action, params) {
	events[action](params);
}

userNotifier = new UserNotifier();