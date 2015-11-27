Meteor.publish("panels", function() {
	return Panels.find({});
});