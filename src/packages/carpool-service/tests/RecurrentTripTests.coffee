# To launch tests
# meteor test-packages packages/carpool-service --settings settings.json
#
# Export trip:
# meteor mongo -U
# mongodb://127.0.0.1:3001/meteor
# mongoexport -h localhost:3001 -d meteor -c trips -q '{ _id : "Wud6i5rehz26TYGjf"}' --out trip.json
moment = require 'moment'


###
   Test preparation
###
if Meteor.isServer
  aspect.push "trip-publish"

  matcher = new TripsMatcher();

  Stops._ensureIndex({"loc": "2d" });
  Trips._ensureIndex({"fromLoc": "2d" });
  Trips._ensureIndex({"toLoc": "2d" });
  Trips._ensureIndex({"stops.loc": "2d" });
  # Fixtures
  removed = Trips.remove({});
  d "Removed", removed
  #console.log "Fixture json": trip
  trip = JSON.parse(Assets.getText("tests/recurrent-trip.json"))
  trip.bTime = moment("2016-06-20T13:00:00").toDate() # Monday
  Trips.insert(trip);
  trip = JSON.parse(Assets.getText("tests/trip.json"));
  trip.bTime = moment("2016-06-30T13:00:00").toDate() # Wednesday
  Trips.insert(trip);

if Meteor.isServer
  Tinytest.add "Recurrent - Next monday", (test) ->
    thatMonday = moment("2016-06-27T13:00:00") # Monday
    next = nextDate {repeat: [1,3,4], bTime: moment("2012-06-26T16:30:00")}, thatMonday
    #d "Next:", next

  Tinytest.add "Recurrent - Next Sunday", (test) ->
    thatMonday = moment("2016-06-27T13:00:00") # Monday
    next = nextDate {repeat: [6], bTime: moment("2012-06-26T16:30:00")}, thatMonday
    #d "Next:", next

  Tinytest.add "Recurrent - Next week", (test) ->
    thatFriday = moment("2016-07-01T13:00:00") # Friday
    next = nextDate {repeat: [0,3], bTime: moment("2012-06-26T16:30:00")}, thatFriday
    d "Next:", next
    test.isTrue moment(next).isSame("2016-07-04T16:30:00"), "But was #{next}"

  Tinytest.addAsync "Recurrent - Notification for next date trip", (test, done) ->
    # Take the same trip
    #trip = JSON.parse(Assets.getText("tests/recurrent-trip.json"));
    # and modify it time not to match
    trip =
      _id: "xxx"
      role: "rider"
      bTime: moment("2016-06-30T13:00:00").toDate() # Monday
    test.length(matcher.findMatchingTrips(trip), 2, "Should match two trips");
    done();

  Tinytest.addAsync "Recurrent - No notification for different dates", (test, done) ->
    # Take the same trip
    trip = JSON.parse(Assets.getText("tests/recurrent-trip.json"));
    # and modify it time not to match
    trip =
      role: "rider"
      bTime: moment("2016-06-28T13:00:00").toDate() # Monday
    test.length(matcher.findMatchingTrips(trip), 0, "Should match zero trip");
    done();


if Meteor.isClient

  Tinytest.addAsync "Recurrent - Filter by date should return next date", (test, done) ->
    #d "Read active trips"
    subscription = Meteor.subscribe 'activeTrips', {
        role: "driver"
        bTime: moment("2016-06-30T13:00:00").toDate() # Monday
      },
      onReady: ()->
        trips = Trips.find().fetch();
        test.length(trips, 2, "Should match all trips");
        test.isTrue(moment(trip.bTime).isSame("2016-06-30T13:00:00"), "But was #{trip.bTime}") for trip in trips
        #d "Expect actual trip to have next monday: #{monday.format('ll')}", actualTrip
        subscription.stop();
        done();

  # TODO create geo tests: (match by A or match by stops) and match by B

  # TODO test for filter trips by bTime
