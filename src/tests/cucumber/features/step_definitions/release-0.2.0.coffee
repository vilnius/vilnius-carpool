d = console.log.bind @, "---"
url = require('url');

module.exports = ()->

  ###
  Main flow
  ###
  @Then /^I see my trip on MUI$/, (table)->
    client.url(url.resolve(process.env.ROOT_URL, "/m/your/drives"));
    client.waitForExist "[data-cucumber='trips-list']"
    # client.waitForExist("[data-cucumber='your-trips']", 5000);
    # client.click("[data-cucumber='your-trips']");
    expect(client.getText("[data-cucumber='trips-list'] div:nth-child(1) span div div div:nth-child(1) div:nth-child(1) span:nth-child(1)")).toEqual(table.hashes()[0].fromAddress)

  @Then /^Clicked on "([^]*)" to see saved trip$/, (button, table)->
    client.click button
    client.waitForExist "[data-cucumber='screen-your-drive']"

  @Then /^User "([^"]*)" gets notification and sends request on MUI$/, (username)->
    #client.saveScreenshot('../build/screenshots/uc9-driverTrip.png')
    @TestHelper.urlLogin("/loginUsername", username);
    client.url(url.resolve(process.env.ROOT_URL, "/notifications"));
    #client.saveScreenshot('../build/screenshots/uc9-notifications.png')
    client.waitForExist "[data-cucumber='notification']"
    client.click "[data-cucumber='request']"
    client.waitForExist "[data-cucumber='withdraw-request']"

  @Then /^user "([^"]*)" gets notification and confirms request on MUI$/, (username)->
    @TestHelper.urlLogin("/loginUsername", username);
    client.url(url.resolve(process.env.ROOT_URL, "/notifications"));
    client.waitForExist "[data-cucumber='notification']"
    client.click "[data-cucumber='confirm']"

  @Then /^user "([^"]*)" gets confirmation and sends message "([^"]*)"$/, (username, text)->
    @TestHelper.urlLogin("/loginUsername", username);
    client.url(url.resolve(process.env.ROOT_URL, "/notifications"));
    client.waitForExist "[data-cucumber='review-confirmed']"
    client.click "[data-cucumber='review-confirmed']"
    client.waitForExist "[data-cucumber='chat']"
    client.click "[data-cucumber='chat']"
    client.waitForExist("[data-cucumber='chat-input']")
    #d "Enter text #{message} for #{cdUser}"
    client.setValue("input[id='chatInput']", text)
    client.keys("Enter");

  ###
  Variations
  ###
  @Then /^User "([^"]*)" gets notification and reviews drive$/, (username)->
    #client.saveScreenshot('../build/screenshots/uc9-driverTrip.png')
    @TestHelper.urlLogin("/loginUsername", username);
    client.url(url.resolve(process.env.ROOT_URL, "/notifications"));
    #client.saveScreenshot('../build/screenshots/uc9-notifications.png')
    client.waitForExist "[data-cucumber='notification']"
    client.click "[data-cucumber='review-request']"
