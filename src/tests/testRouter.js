suite('Router', function() {
	test('Anonymouse goes to / and appears on landing page', function(done, server, cA, cB) {
		cA.eval(function() {
			Meteor.setTimeout(function() {
				d("Router tests starting:", Router.current().route.name, ["INFO"]);
				emit("done");
			}, 2000);			
		}).once('done', function() {
			done();
		});
	});
});