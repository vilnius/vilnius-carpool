d = console.log.bind @, "---"

module.exports = ()->
  #_ = require('underscore');

  ###
  For test preparation sophisticated function created which takes addresses
  turns then into location and saves the trip using carpoolService
  ###
  @Given /^Assure "([^"]*)" trip:$/, (user, table)->
    @TestHelper.login(user);
    #d "Table", table.hashes()
    for trip in table.hashes()
      # Trip stops calculation is time consuming and fails on travis sometimes
      client.timeoutsAsyncScript(10000);
      result = client.executeAsync (trip, done) ->
          trip.time = new Date()
          #d "Trips:", carpoolService.getOwnTrips();
          mapView.clarifyPlace null, trip.fromAddress, (err, fromLoc)->
            mapView.clarifyPlace null, trip.toAddress, (err, toLoc)->
              trip.toLoc = googleServices.toLocation(toLoc)
              trip.fromLoc = googleServices.toLocation(fromLoc)
              carpoolService.saveTrip trip, (err)->
                if err then done err else done trip
        , trip
    #client.saveScreenshot('../build/screenshots/uc3-assureTrips.png')
    d "Result:",result

  @Given /^I see no trips filtered$/, ()->
    client.waitForExist(".noActiveTrips");

  @Then /^I see the stops on the route:$/, (table)->
    element = ".stopsOnRoute"
    client.waitForExist(element);
    stopsShown = client.getText(".stopsOnRoute .stop");
    for stop in table.hashes()
      d "Check the stop #{stop.name}",
      expect(stopsShown).toContain(stop.name);
      #expect(_(stopsShown).contains(stop.name)).toBe(true);
      #expect().toEqual(stopTitle)
