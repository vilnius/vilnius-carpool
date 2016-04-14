d = console.log.bind @, "---"

module.exports = ()->

  @Then /^I see my MUI trip$/, (table)->
    client.waitForExist(".myTripFrom", 5000);
    expect(client.getText(".myTripFrom")).toEqual(table.hashes()[0].from)
    expect(client.getText(".myTripTo")).toEqual(table.hashes()[0].to)
