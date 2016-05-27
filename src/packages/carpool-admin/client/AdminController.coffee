###
  Base admin controller. Checks has use admin role
###
class @AdminController extends RouteController
  subscriptions: ()->
    [Meteor.subscribe("adminUserContacts")]

  onBeforeAction: (pause) ->
    @render('navbar', {to: 'navbar'});
    d "Check the user has admin role", Meteor.user();
    if _(Meteor.user()?.roles).contains('root')
      @render();
    else
      @render 'AdminLogin'
