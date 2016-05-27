Meteor.startup ()->
  Stops._ensureIndex({"loc": "2d" });
  Trips._ensureIndex({"fromLoc": "2d" });
  Trips._ensureIndex({"toLoc": "2d" });
  Trips._ensureIndex({"stops.loc": "2d" });

  if Meteor.settings.oauth
    if Accounts.loginServiceConfiguration.find().count() == 0
      da ['install'], 'Creating login configurations'
      Accounts.loginServiceConfiguration.insert Meteor.settings.oauth.google
      Accounts.loginServiceConfiguration.insert Meteor.settings.oauth.facebook
  else
    console.warn "Run meteor with --settings settings.json option"

  # Create admin with email in settings
  if Meteor.settings.admin
    if Meteor.users.find({"emails.address": Meteor.settings.admin.username}).count() == 0
      da ['install'], 'Creating admin user', Meteor.settings.admin
      Accounts.createUser
        email: Meteor.settings.admin.username
        password: Meteor.settings.admin.password
        profile:
          name: 'Admin'
      Meteor.users.update {"emails.address": Meteor.settings.admin.username}, $set: roles: ['root']
