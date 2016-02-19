d = console.log.bind @, "---"

module.exports = ()->

  @Given /^Trip removed$/, ()->
    #d "Remove old trips"
    server.call "removeTrips", "user1@tiktai.lt"

  @Then /^I see my trip$/, (table)->
    element = ".myTripFrom"
    client.waitForExist(element);
    expect(client.getText(element)).toEqual(table.hashes()[0].from)

  @Then /^I see the stops on the road$/, ()->
    pending();
