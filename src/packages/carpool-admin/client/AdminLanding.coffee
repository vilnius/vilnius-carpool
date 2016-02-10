class @AdminLandingController extends AdminController
  subscriptions: ()->
    [Meteor.subscribe("adminUserContacts")]
