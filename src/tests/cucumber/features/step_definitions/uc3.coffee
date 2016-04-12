d = console.log.bind @, "---"

module.exports = ()->
  #_ = require('underscore');

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
