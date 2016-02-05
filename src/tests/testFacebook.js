var assert = require('assert');

suite('Facebook', function() {

	test('Get tranzuok feed - not working as no way login', function(done, server, cA, cB) {
		server.eval(function() {
	    	Accounts.loginServiceConfiguration.insert({
	    		service: "facebook",
	    		clientId: "",
	    		secret: ""
	    	});
			emit('ready');
		}).once('ready', function() {
			cA.eval(function() {
				Meteor.loginWithFacebook(function(error) {
					d("Login result",error);
					emit('done');
				});
			}).once('done', function(post) {
				done();
			});
		});


	});

});
