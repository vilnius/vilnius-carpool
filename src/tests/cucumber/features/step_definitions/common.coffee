d = console.log.bind @, "---"

module.exports = ()->
  url = require('url');
#_ = require('underscore');
  ###
  For test preparation sophisticated function created which takes addresses
  turns then into location and saves the trip using carpoolService
  ###
  @Given /^Assure "([^"]*)" trip:$/, (user, table)->
    @TestHelper.urlLogin("/loginUsername", user);
    #d "Table", table.hashes()
    client.timeoutsAsyncScript(15000);
    for trip in table.hashes()
      # Trip stops calculation is time consuming
      result = client.executeAsync (trip, done) ->
          trip.time = new Date()
          trip.bTime = new Date()
          #d "Trips:", carpoolService.getOwnTrips();
          carpoolService.clarifyPlace null, trip.fromAddress, (err, fromLoc)->
            carpoolService.clarifyPlace null, trip.toAddress, (err, toLoc)->
              trip.toLoc = googleServices.toLocation(toLoc)
              trip.fromLoc = googleServices.toLocation(fromLoc)
              carpoolService.saveTrip trip, (err)->
                if err then done err else done trip
        , trip
    #client.saveScreenshot('../build/screenshots/uc3-assureTrips.png')
    #d "Result:",result


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

  @When /^Login through "([^"]*)" with "([^"]*)"$/, (path, username)->
    #d "Do login #{username}"
    @TestHelper.urlLogin(path, username)

  @Then /^I see "([^"]*)" text "([^"]*)"$/, (element, text)->
    client.waitForExist(element);
    expect(client.getText(element)).toEqual(text)

  @Then /^I see "([^"]*)"$/, (element)->
    d "Wait for exist #{element}"
    client.waitForVisible element, 10000;
    d "Visible #{element}"

  @Then /^I see "([^"]*)" in "([^"]*)"$/, (element, path)->
    link = process.env.ROOT_URL + path;
    client.url(link);
    client.waitForExist(element);

  @When /^I enter:$/, (messages)->
    #d "Enter", messages
    for key, value of messages.hashes()[0]
      d "Fill #{key}=#{value}"
      client.setValue("input[id=\"#{key}\"]", value);
      client.keys("Enter");

  @When /^I enter into "([^]*)":$/, (element, messages)->
    client.waitForVisible element, 10000;
    #d "Enter", messages
    for key, value of messages.hashes()[0]
      d "Fill #{key}=#{value}"
      client.setValue("input[id=\"#{key}\"]", value);
      client.keys("Enter");

  @When /^Click on "([^]*)"$/, (button)->
    d "Clicking #{button}"
    client.click button

  @When /^Clicked on "([^]*)" to see "([^]*)"$/, (button, element)->
    d "Clicking #{button}"
    client.click button
    client.waitForExist element, 10000;

  @When /^Type "([^]*)$"/, (text)->
    client.keys(text);


  @Then /^I see the stops on the route:$/, (table)->
    element = "[data-cucumber='stops-on-route']"
    client.waitForExist(element);
    stopsShown = client.getText("[data-cucumber='stops-on-route'] [data-cucumber='stop']");
    for stop in table.hashes()
      d "Check the stop #{stop.name}",
      expect(stopsShown).toContain(stop.name);
      #expect(_(stopsShown).contains(stop.name)).toBe(true);
      #expect().toEqual(stopTitle)

  @Given /^Notifications for "([^"]*)" removed$/, (user)->
    #d "Remove old trips"
    server.call "removeNotifications", user
