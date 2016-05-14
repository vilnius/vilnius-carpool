d = console.log.bind @, "---"
url = require('url');

module.exports = ()->

  @Then /^I see my MUI trip$/, (table)->
    client.waitForExist("[data-cucumber='your-trips']", 5000);
    client.click("[data-cucumber='your-trips']");

    expect(client.getText("[data-cucumber='trips-list'] div span div div div:nth-child(1) div:nth-child(1) span:nth-child(1)")).toEqual(table.hashes()[0].fromAddress)

  @Then /^User "([^"]*)" gets mui notification and sends request$/, (username)->
    #client.saveScreenshot('../build/screenshots/uc9-driverTrip.png')
    @TestHelper.urlLogin("/loginUsername", username);
    client.url(url.resolve(process.env.ROOT_URL, "/notifications"));
    #client.saveScreenshot('../build/screenshots/uc9-notifications.png')
    client.waitForExist "[data-cucumber='notification']"
    client.click "[data-cucumber='request']"

  @Then /^user "([^"]*)" confirms request on mui$/, (username)->
    @TestHelper.urlLogin("/loginUsername", username);
    client.url(url.resolve(process.env.ROOT_URL, "/notifications"));

    client.waitForExist "[data-cucumber='notification']"
    client.click "[data-cucumber='request']"
