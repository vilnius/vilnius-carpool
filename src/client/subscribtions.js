Subs = {
	dep: new Deps.Dependency(),
	//ownTrips: Meteor.subscribe("ownTrips"),
	//activeTrips: Meteor.subscribe("activeTrips"), // do not initialize as accumulates too much items
	groups: Meteor.subscribe('groups'),
	subscribe: function(name, handler) {
		da(['data-publish'], "Setting subscribtion handler:", name);
		this[name] = handler;
		this.dep.changed();
	},
	ready: function(names) {
		da(['data-publish'], "Getting subscribtion handler:", names);
		this.dep.depend();
		var self = this;
		var result = true;
		for (i in names) {
			da(['data-publish'], "Checking:"+names[i], names);
			if(!self[names[i]].ready()) {
				result = false;
			}
		}
		da(['data-publish'], "Result:"+result, names);
		return result;
	}
};

//Meteor.subscribe("userData"); // TODO conflicts with userContacts subscribtion
this.userSubs = Meteor.subscribe("userContacts");
Meteor.subscribe("groupMemberData");

//Meteor.subscribe("streets");
Meteor.subscribe("meanings");
Meteor.subscribe("favorites");
