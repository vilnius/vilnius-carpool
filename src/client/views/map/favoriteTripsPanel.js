Template.MapFavoriteTripsPanel.helpers({
	hasFavoriteTrips: function() {
		return trip.getFromAddress() && tripClient.getFavoriteTrips().length != 0;
	}
});

Template.MapFavoriteTripsPanel.events({
	'click .goFavorite': function (event, template) {
		var query = this;
		query._id = undefined;
		query.time = new Date();
		query.group = template.data.group && template.data.group._id;
		query.role = 'driver';
		query.fromLoc = Session.get("fromLngLat");
		da(['favorite-trips'],"Go favorite trip:", query);
		$('.goFavorite').button('loading');
		TripBusinessLogic.saveTrip(query, function(error, result) {
			d("Saved trip:", result);
			$('.goFavorite').button('reset');
			$("*[id^='trip-to']").val("");
			Session.set('selectedTrip', result);
		});
		$(event.target).attr("disabled");
		mapController.showTrip(query)
	}
})
