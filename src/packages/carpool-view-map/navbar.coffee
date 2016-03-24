Template.navbarCarpool.events
  'click .logout': (event, template) ->
    da [ 'viewport-map' ], 'Do logout and go to first page'
    Meteor.logout()
    #da(['group-security'], "Go to MainLogin");
    Router.go 'CarpoolLogin'
    
  'click .nav a': (event, template) ->
    $('.navbar-toggle').click()
