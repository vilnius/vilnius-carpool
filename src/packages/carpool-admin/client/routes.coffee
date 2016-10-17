###
# Stolen from
# https://github.com/arillo/meteor-flow-router-helpers
# as package 'use' came with FlowRouter not found ...
###
Template.registerHelper 'pathFor', (path, view = {hash:{}}) ->
  throw new Error('no path defined') unless path
  # set if run on server
  view = hash: view unless view.hash
  if path.hash?.route?
    view = path
    path = view.hash.route
    delete view.hash.route
  query = if view.hash.query then FlowRouter._qs.parse(view.hash.query) else {}
  hashBang = if view.hash.hash then view.hash.hash else ''
  FlowRouter.path(path, view.hash, query) + (if hashBang then "##{hashBang}" else '')

adminRoutes = FlowRouter.group(
  prefix: '/admin'
  name: 'Admin'
  triggersEnter: [
    (context, redirect) ->
      # console.log('Security check', userSubs.ready());
      # if(undefined == Meteor.user()) {
      #   redirect("/login")
      # }
 ])

adminRoutes.route '/',
  name: 'AdminLanding'
  action: (params, queryParams) ->
    BlazeLayout.render("adminLayout", {content: "AdminLanding"});

adminRoutes.route '/stops',
  name: 'StopsAdmin'
  action: (params, queryParams) ->
    BlazeLayout.render("adminLayout", {content: "StopsAdmin"});

adminRoutes.route '/users',
  name: 'UsersAdmin'
  action: (params, queryParams) ->

adminRoutes.route '/trips',
  name: 'TripsAdmin'
  action: (params, queryParams) ->

adminRoutes.route '/feedback',
  name: 'FeedbackAdmin'
  action: (params, queryParams) ->
    #d "Rendering FeedbackAdmin"
    BlazeLayout.render("adminLayout", {content: "FeedbackAdmin"});
