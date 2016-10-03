d = console.log.bind @, "---"

waitAndClick = (selector)->
  client.waitForVisible(selector);
  client.click(selector);

module.exports = ()->
  url = require('url');
  _ = require('underscore');

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
    @TestHelper.screenShot("uc3-assureTrips.png");
    #d "Result:",result

  @Given /^Assure stops:$/, (table)->
    for stop in table.hashes()
      loc = (parseFloat(deg) for deg in stop.Location.split(","));
      d "Location: #{loc}"
      server.call "assureStop", stop.Name, loc


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
    @TestHelper.urlLogin(path, username);

  @When /^I add trip as "([^"]*)":$/, (username, table)->
    row = table.hashes()[0]
    # Login
    @TestHelper.urlLogin("/loginUsername", username);
    client.waitForVisible "[data-cucumber='add-trip-form']", 3000;
    @TestHelper.screenShot("TripForm.png");

    # "Enter fields"
    fields = _(row).pick("trip-fromAddress", "trip-toAddress")
    for key, value of fields
      waitAndClick "[data-cucumber='#{key}']"
      client.waitForVisible "[data-cucumber='location-autocomplete-form']", 3000
      client.waitForVisible "[data-cucumber='address-input']"
      client.setValue "[data-cucumber='address-input']", value
      client.waitForVisible "[data-cucumber-default-suggestions='false']"
      waitAndClick "[data-cucumber='suggestion-0']"

    role = row.type
    if role == 'drive'
      waitAndClick "[data-cucumber='create-drive']"
    else
      waitAndClick "[data-cucumber='search']"
      waitAndClick "[data-cucumber='create-ride-button']"

    # Check trip is created
    client.waitForExist "[data-cucumber='screen-your-#{row.type}']"
    client.waitForExist "[title='To']"
    @TestHelper.screenShot("Your#{role.charAt(0).toUpperCase() + role.slice(1)}.png");

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
