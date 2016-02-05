tripClient = new TripBusinessLogic();

trip = null;

/*** Map template ***
 * separate template to catch render event and put it into constant
 */
Template.Main.rendered = function() {
};

Template.Main.isMapHidden = function() {
	return Session.get("isMapVisible") ? '' : 'display: none;';
};

Template.Main.hasFavoriteTrips = function() {
	return Session.get("currentAddress") && tripClient.getFavoriteTrips().length != 0;
};

// Required to fall into default, when no other tabs are selected
Template.Main.isMainTabActive = function() {
	var route = Router.current().route.name;
	return route == 'Main' || (name != 'Filter') ? 'active' : '';
};


Template.MapCanvas.rendered = function() {
	//d("Init maps when google code is ready");
	ga('send', 'event', 'mvp', 'main-rendered');

	/*
	if(google.maps) {
		mapController.init();
	} else {
    google.setOnLoadCallback(mapController.init());
	}
	*/
}

//*** Helpers ***
Handlebars.registerHelper('userPictureUrl', function(userId){
	var user = Meteor.users.findOne(userId);
	var result = "/img/Man_Silhouette.png";
	//d("User picture:"+userId, user);
	if(user) {
		return user.services.facebook ?  "http://graph.facebook.com/"+user.services.facebook.id+"/picture" : result;
	} else {
		return result;
	}
});

Handlebars.registerHelper('userFacebookId',function(userId){
	var user = Meteor.users.findOne(userId);
	if(user) {
		return user.services.facebook ?  user.services.facebook.id : "";
	} else {
		return "";
	}
});
