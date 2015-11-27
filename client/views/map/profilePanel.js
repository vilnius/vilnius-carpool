Template.profilePanel.events({
	"click .accordion": function(event, template) {

	},
	// TODO dry register and login
	'click .register': function (event, template) {
		var name = template.find('#userName').value;
		var email = template.find('#userEmail').value;
		var password = template.find('#userPassword').value;

		if(!Match.test(name, NonEmptyString))
		   return Session.set("registrationError", "Name"+" should not be empty");
		if(!Match.test(email, NonEmptyString))
			return Session.set("registrationError", "Email"+" should not be empty");
		if(!Match.test(password, NonEmptyString))
			return Session.set("registrationError", "Password"+" should not be empty");

		d("Registering:", email);
		Accounts.createUser({
			email: email,
			password: password,
			profile: {
				name: name
			}
		}, function(error) {
			d("Registration of user "+email, error);
			if(!error) {
				Router.go(Session.get("workflow") || mapWorkflow.start.page);
				Session.set("registrationError","");
			} else {
				Session.set("registrationError", error.reason);
			}
		})
	},

	'click .login': function (event, template) {
		var user = template.find('#inputUsername').value;
		var password = template.find('#inputPassword').value;

		d("Login user "+user, ['login-error']);
		Meteor.loginWithPassword(user, password, function(error) {
			if(error) {
				d('Log in '+user+'  error: '+error.reason);
				Session.set("loginError", error.reason);
			} else {
				//d("Logged in");
				Router.go(Session.get("workflow") || 'Map');
				Session.set("loginError","");
			}
		});
	},
	'click .facebookLogin': function (event, template) {
		Meteor.loginWithFacebook(function(error) {
			if(error) {
				d('Log in with facebook error: ', error);
			} else {
				var nextPage = Session.get("workflow") || 'Map';
				d("Login with facebook succesful, redirecting:"+nextPage);
				Router.go(nextPage);
			}
		});
	},
	'click .logout': function (event, template) {
		da(['viewport-map'], "Do logout and go to first page");
    	Meteor.logout();
		//da(['group-security'], "Go to MainLogin");
    	Router.go('Welcome');
	},
});

Template.Adsense.rendered = function() {
	//(adsbygoogle = window.adsbygoogle || []).push({});
}
