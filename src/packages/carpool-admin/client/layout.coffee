Template.adminLayout.onCreated ()->
  @autorun ()=>
    @subscribe "adminUserContacts"

Template.adminLayout.helpers
  isAdmin: ()->
    #d "Check the user has admin role", Meteor.user();
    _(Meteor.user()?.roles).contains('root')
