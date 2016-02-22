enableCityLookup = function(city) {
	$(city).typeahead({source:
		function (query, process) {
			Meteor.call('typeaheadCity', {query: query}, function (error, result) {
				process(result);
			});
		}
    });
}

enableStreetLookup = function(field, city) {
	$(field).typeahead({
		source: function(query, process) {
			//d("Call lookup function", query);
			Meteor.call('lookupStreet', {query: query, city: city}, function (error, result) {
				process(result);
			});
		} 
	});
}
