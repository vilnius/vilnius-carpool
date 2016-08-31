moment = require 'moment'

# console.log 'Tiny tests'
d = console.log.bind console
carpoolService = undefined;

loadGoogle = (cb)->
  $.ajax
    #url: 'https://apis.google.com/js/client.js?onload=handleClientLoad'
    url: "http://www.google.com/jsapi?onload=handleClientLoad"
    dataType: 'script'
    success: ->
      d "Google key:", Meteor.settings.public.googleApi.key
      carpoolService = new CarpoolService {key: Meteor.settings.public.googleApi.key}
      # google.load "maps", "3",
      #   other_params: "libraries=geometry,places&key=AIzaSyC4jEbNbglLxwxH7_gcmDMxWxwYOAPVVJM",
      # callback: cb
    error: (e) ->
      console.warn 'Error', e
    async: true

if Meteor.isServer
  aspect.push "trips-matcher"
  matcher = new TripsMatcher();

  # { fromLoc: { '$near': [ 25.2655, 54.6818 ],'$maxDistance': 0.008997777548945408 }}
  Tinytest.add "Match - By one stop and B point", (test) ->
    #Trips.remove({});
    ride = JSON.parse(Assets.getText("tests/CarpoolServiceClientTest-ride.json"))
    ride.bTime = moment().toDate() # Monday
    Trips.insert(ride);
    d "Trips in DB:", _(Trips.find({}, sort: time: -1).fetch()).pluck("fromAddress", "toAddress");

    drive = JSON.parse(Assets.getText("tests/CarpoolServiceClientTest-drive.json"))
    test.length(matcher.findMatchingTrips(drive), 1, "Should match one trip");

if Meteor.isClient
  loadGoogle();

  Tinytest.addAsync "CarpooService - getTripPath ", (test, done) ->
    # url = window.location.origin+"/download/product-images.html"
    googleServices.afterInit ()->
      # googleServices.init({key: "AIzaSyC4jEbNbglLxwxH7_gcmDMxWxwYOAPVVJM"});
      trip =
        toLoc : [25.26246500000002, 54.6779097]
        fromLoc : [25.305228100000022,54.6877209]
        bTime: new Date()
      d "Calling get trip path"
      carpoolService.getTripPath trip, (err, route)->
        console.log "Got result:", route
        done();
