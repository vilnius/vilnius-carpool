d = console.log.bind @, "---"

module.exports = ()->
  url = require('url');
#_ = require('underscore');

  @Given /^I am logged off$/, ()->
    client.url(url.resolve(process.env.ROOT_URL, "/"));
    client.waitForExist('#left-panel');
    if client.isVisible('.profile-form')
      client.click(".showLogout");
      client.waitForVisible('.logout');
      client.click(".logout");

  @When /^Login with "([^"]*)"$/, (username)->
    #d "Do login #{username}"
    @TestHelper.login(username)

  @Then /^I see "([^"]*)" text "([^"]*)"$/, (element, text)->
    client.waitForExist(element);
    expect(client.getText(element)).toEqual(text)

  @Then /^I see "([^"]*)"$/, (element)->
    d "Wait for exist #{element}"
    client.waitForExist element, 1000;
    d "Found #{element}"

  @Then /^I see "([^"]*)" in "([^"]*)"$/, (element, path)->
    link = process.env.ROOT_URL + path;
    d "Link to create evaluation #{link}"
    client.url(link);
    client.waitForExist(element);

  @When /^I enter:$/, (messages)->
    #d "Enter", messages
    for key, value of messages.hashes()[0]
      d "Fill #{key}=#{value}"
      client.setValue("input[id=\"#{key}\"]", value);
      client.keys("Enter");

  @When /Click on "([^]*)"/, (button)->
    d "Clicking #{button}"
    client.click button

  @When /^Type "([^]*)$"/, (text)->
    client.keys(text);

  ###
  For test preparation sophisticated function created which takes addresses
  turns then into location and saves the trip using carpoolService
  ###
  @Given /^Assure "([^"]*)" trip:$/, (user, table)->
    @TestHelper.login(user);
    #d "Table", table.hashes()
    client.timeoutsAsyncScript(10000);
    for trip in table.hashes()
      # Trip stops calculation is time consuming
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
    #d "Result:",result
