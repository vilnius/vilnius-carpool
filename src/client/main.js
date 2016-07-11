/**
* main.js loads last
*
* Date 2013.11.15
* Version 0.0.1
*/

Meteor.startup(function () {
	//console.log("Creating MapBridge");
	//mapController = new MapBridge();
});


/*
Router.configure({
});

Router.map(function() {
  	this.route('About', {path: '/about'});
  	this.route('Profile', {path: '/profile', controller: 'ProfileController'});
  	this.route('Main', {path: '/public',	controller: 'TripController'});

  	this.route('Filter', {path: ':group?/f', template: "Main", controller: 'TripController'});
  	// Idea based on landing page, but
  	this.route('TripViewLogin', {path:'/p/trip/view/:_id', layoutTemplate: 'loginLayout'});
  	this.route('TripView', {path:'/trip/view/:_id', controller: 'TripActionController'});
  	this.route('TripEdit', {path:'/trip/edit/:_id', controller: 'TripActionController'});
  	this.route('TripAccepted', {path:'/trip/accepted/:_id', controller: 'TripAcceptedController'});

		this.route('Train', {path: '/train', controller: 'TrainController'});

  	this.route('NewGroupConfirmation', {path: '/ng', controller: 'EditGroupController'});
  	this.route('EditGroup', {path: '/cg', controller: 'EditGroupController'});
  	this.route('EnrollIntoGroupLogin', {path:'/p/e/:id', layoutTemplate: 'loginLayout',
  		data: function() {
  			return Groups.findOne({groupId:this.params.id});
  	    }
  	});
  	this.route('EnrollIntoGroup', {	path: '/e/:id',	controller: 'EnrollController'});
  	this.route('WelcomeToGroup', {
  		path: '/wg/:id',
  		controller: 'EnrollController',
  		yieldTemplates: {
  	      'welcomeDescription': {to: 'description'}
  	    }
  	});
  	this.route('GroupLanding', {
  		path: '/g/:niceLink',
  		template: "Login",
  		yieldTemplates: {
  	      'groupDescription': {to: 'description'}
  	    },
  		layoutTemplate: 'landingLayout',
  	});
  	this.route('GroupRequest', {
  		path: '/gr/:niceLink',
  		layoutTemplate: 'layout',
  		yieldTemplates: {
  			'navbar': {to: 'navbar'}
  		}
  	});
		// This is very general map - should be defined last
		this.route('MapGroup', {path: '/:niceLink?',	controller: 'MapGroupController'});

  	Session.setDefault("pathForMain", Router.routes['Main'].path())
});
*/

Template.loadingSplash.progress = function() {
	//d("Gettign progress:",Session.get("progress"));
	return JSON.stringify(Session.get("progress"));
}
