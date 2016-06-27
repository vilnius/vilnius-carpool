# To launch tests
# meteor test-packages packages/carpool-service --settings settings.json
#
# Export trip:
# meteor mongo -U
# mongodb://127.0.0.1:3001/meteor
# mongoexport -h localhost:3001 -d meteor -c trips -q '{ _id : "Wud6i5rehz26TYGjf"}' --out trip.json
moment = require 'moment'

if Meteor.isServer
  # Fixtures
  removed = Trips.remove({});
  d "Removed", removed
  trip = JSON.parse(Assets.getText("tests/recurrent-trip.json"));
  #console.log "Fixture json": trip
  Trips.insert(trip);

  Tinytest.add "Recurrent - Next monday", (test) ->
    thatMonday = moment("2016-06-27T13:00:00") # Monday
    next = nextDate {repeat: [1,3,4], bTime: moment("2012-06-26T16:30:00")}, thatMonday
    #d "Next:", next

  Tinytest.addAsync "Recurrent - Notification should be send for next date trip", (test, done) ->
    done();


if Meteor.isClient

  Tinytest.addAsync "Recurrent - Find should return next date", (test, done) ->
    #d "Read active trips"
    subscription = Meteor.subscribe 'activeTrips',
      onReady: ()->
        actualTrip = Trips.findOne();
        monday = moment().day(1);
        d "Expect actual trip to have next monday: #{monday.format('ll')}", actualTrip
        subscription.stop();
        done();
      onStop: ()->
        #d "Stop subscribtion"
