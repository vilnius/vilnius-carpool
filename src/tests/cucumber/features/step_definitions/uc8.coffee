d = console.log.bind @, "---"

module.exports = ()->

  @Given /^Trips removed$/, ()->
    #d "Remove old trips"
    server.call "removeTrips", "user1@tiktai.lt"
    server.call "removeTrips", "user2@tiktai.lt"

  @Given /^Stops exists$/, ()->
    server.call "assureStop", "Filaretu", [25.309768170118332,54.68432633458854]
    server.call "assureStop", "Kauno", [25.268912762403488,54.671944985679346]

  @Then /^I see my trip$/, (table)->
    element = ".myTripFrom"
    client.waitForExist(element);
    expect(client.getText(element)).toEqual(table.hashes()[0].from)

  @Then /^I see the stop "([^"]*)" on the route$/, (stopTitle)->
    element = ".stopsOnRoute"
    client.waitForExist(element);
    expect(client.getText(element)).toEqual(stopTitle)

  @Then /^The stop "([^"]*)" is marked$/, (stopTitle)->
    element = "[title='#{stopTitle}']"
    client.waitForExist(element);
