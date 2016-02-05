WruController = RouteController.extend({
	template: 'Map',
	layoutTemplate: 'wruLayout', 
	yieldTemplates: {
		MapFullsreenCanvas: {to: 'map'}
	},
});

Template.Wru.rendered = function() {
	mapController.watchPosition(function(err, result) {
		da(['wru'], "Watched possition changed:"+result.latlng+"~"+result.acc);
		mapController.dropWruMarker(result.latlng, result.acc);
	});
}