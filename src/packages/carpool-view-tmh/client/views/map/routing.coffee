###
  Begin moving routing.js to coffee
###


Router.map ->
  @route 'Welcome', {path: '/',	controller: 'MapController'};
  @route 'Login', {path: '/login',	controller: 'MapController'};
  @route 'Register', {path: '/register',	controller: 'MapController'};
  @route 'Map', {path: '/trips',	template: "TripAddForm", controller: 'MapController'};
