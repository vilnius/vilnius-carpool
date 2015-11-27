Template.allTripsPanel.events({
	'click .toRadius': function (event, template) {
		var radius = parseInt($(event.currentTarget).val());
		//d("Filter to radius", $(event.currentTarget).val());
		Session.set("toRadius", radius);
		mapController.setSearchToMarkerRadius(radius);
	}	
});