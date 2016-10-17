d = console.log.bind @, "---"

module.exports = ()->
  #_ = require('underscore');

  @Given /^I see no trips filtered$/, ()->
    client.waitForExist(".noActiveTrips");
