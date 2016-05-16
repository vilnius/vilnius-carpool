d = console.log.bind @, "---"
url = require('url');

module.exports = ()->

  @Then /^I see my trip on MUI$/, (table)->
    client.url(url.resolve(process.env.ROOT_URL, "/m/your/drives"));
    client.waitForExist "[data-cucumber='trips-list']"
    # client.waitForExist("[data-cucumber='your-trips']", 5000);
    # client.click("[data-cucumber='your-trips']");
    expect(client.getText("[data-cucumber='trips-list'] div:nth-child(1) span div div div:nth-child(1) div:nth-child(1) span:nth-child(1)")).toEqual(table.hashes()[0].fromAddress)
  @Then /^User "([^"]*)" gets notification and sends request on MUI$/, (username)->
    #client.saveScreenshot('../build/screenshots/uc9-driverTrip.png')
    @TestHelper.urlLogin("/loginUsername", username);
    client.url(url.resolve(process.env.ROOT_URL, "/notifications"));
    #client.saveScreenshot('../build/screenshots/uc9-notifications.png')
    client.waitForExist "[data-cucumber='notification']"
    client.click "[data-cucumber='request']"

  @Then /^user "([^"]*)" gets notification and confirms request on MUI$/, (username)->
    @TestHelper.urlLogin("/loginUsername", username);
    client.url(url.resolve(process.env.ROOT_URL, "/notifications"));

    client.waitForExist "[data-cucumber='notification']"
    client.click "[data-cucumber='confirm']"
