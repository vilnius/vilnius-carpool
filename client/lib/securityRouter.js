/**
 @startuml
  skinparam class {
    backgroundColor<<Route>> SeaGreen
  }
  SecurityController <|-- TripController
  TripController <|-- GroupTripController
  TripController <|-- Main<<Route>>
  GroupTripController <|-- Group<<Route>>
 @enduml
*/
SecurityController = RouteController.extend({
  	loadingTemplate: 'loadingSplash',
	before: function() {
	  	var user = Meteor.user();
		da(['group-security'], "If no user redirect to landing page:", user);
	  	if(!user) {
	  		if(Meteor.loggingIn()) {
				this.render(this.loadingTemplate);
			    return this.stop();
	  		} else {
	  			var params = this.params;
  				da(['group-security'], "Routing to MainLogin, controller:"+Router.current().route.name);
  				if('Group' == Router.current().route.name) {
  					var path = Router.routes['Group'].path(params);
  					d("Set workflow after login to check:"+params.niceLink, path, ['trip-view'])
  					Session.set("workflow",path)
		  			Router.go("GroupLanding",{niceLink: params.niceLink});
  				} else {
  	  				Router.go("MainLogin");
  				}
	  			return this.stop();
	  		}
	  	}
    },
});
