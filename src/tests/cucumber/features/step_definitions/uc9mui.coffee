d = console.log.bind @, "---"

module.exports = ()->

  @Then /^I see my MUI trip$/, (table)->
    client.waitForExist("[data-cucumber='your-trips']", 5000);
    client.click("[data-cucumber='your-trips']");

    expect(client.getText("[data-cucumber='trips-list'] div span div div div:nth-child(1) div:nth-child(1) span:nth-child(1)")).toEqual(table.hashes()[0].fromAddress)
