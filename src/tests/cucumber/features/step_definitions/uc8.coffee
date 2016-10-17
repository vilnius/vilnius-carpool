d = console.log.bind @, "---"

module.exports = ()->

  @Given /^Trips removed$/, ()->
    #d "Remove old trips"
    server.call "removeTrips", "ron@tiktai.lt"
    server.call "removeTrips", "dick@tiktai.lt"

  @Given /^Stops exists$/, ()->
    server.call "assureStop", "Filaretu", [25.309768170118332,54.68432633458854]
    server.call "assureStop", "Kauno", [25.268912762403488,54.671944985679346]
    server.call "assureStop", "Audejo", [25.3087453, 54.6785911]


  @Then /^I see my trip$/, (table)->
    element = ".myTripFrom"
    client.waitForExist(element, 5000);
    expect(client.getText(element)).toEqual(table.hashes()[0].from)
    expect(client.getText(".myTripTo")).toEqual(table.hashes()[0].to)

  @Then /^I see active trip$/, (table)->
    element = ".activeTripFrom"
    client.waitForExist(element);
    expect(client.getText(element)).toEqual(table.hashes()[0].from)
    expect(client.getText(".activeTripTo")).toEqual(table.hashes()[0].to)

  @Then /^Element is gone "([^"]*)"$/, (element)->
    client.waitForVisible(element, 5000, true)

  @Then /^I see the stop "([^"]*)" on the route$/, (stopTitle)->
    element = "[data-cucumber='stops-on-route']"
    client.waitForExist(element);
    expect(client.getText(element)).toEqual(stopTitle)

  @Then /^The stop "([^"]*)" is marked$/, (stopTitle)->
    element = "[title='#{stopTitle}']"
    client.waitForExist(element);
