Meteor.startup ()->
  Stops._ensureIndex({"loc": "2d" });
  Trips._ensureIndex({"fromLoc": "2d" });
  Trips._ensureIndex({"toLoc": "2d" });
  Trips._ensureIndex({"stops.loc": "2d" });
