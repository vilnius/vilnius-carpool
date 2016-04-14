d = console.log.bind @, "---"

module.exports = ()->

  @Then /^I see my MUI trip$/, (table)->
    client.waitForExist(".driver-own-trip", 5000);
    expect(client.getText(".driver-own-trip div div div:nth-child(3)")).toEqual(table.hashes()[0].trip)
