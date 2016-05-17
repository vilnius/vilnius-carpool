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
