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

  @Then /^Clicked on "([^]*)" to see saved drive$/, (button, table)->
    client.click button
    client.waitForExist "[data-cucumber='screen-your-drive']"

  @Then /^Clicked on "([^]*)" to see saved ride$/, (button, table)->
    client.click button
    client.waitForExist "[data-cucumber='screen-your-ride']"

  @Then /^User "([^"]*)" gets notification, reviews ride and requests$/, (username)->
    #client.saveScreenshot('../build/screenshots/uc9-driverTrip.png')
    @TestHelper.urlLogin("/loginUsername", username);
    client.url(url.resolve(process.env.ROOT_URL, "/notifications"));
    #client.saveScreenshot('../build/screenshots/uc9-notifications.png')
    client.waitForExist "[data-cucumber='notification']"
    @TestHelper.screenShot("MatchNotification.png");
    client.click "[data-cucumber='review-request']"
    client.waitForExist "[data-cucumber='screen-your-ride-routed']"
    @TestHelper.screenShot("RideRequest.png");
    client.click "[data-cucumber='request']"
    client.waitForExist "[title='To']"

  @Then /^user "([^"]*)" gets notification and confirms request$/, (username)->
    @TestHelper.urlLogin("/loginUsername", username);
    client.url(url.resolve(process.env.ROOT_URL, "/notifications"));
    client.waitForExist "[data-cucumber='notification']"
    @TestHelper.screenShot("ConfirmNotification.png");
    client.click "[data-cucumber='review-confirm']"
    client.waitForExist "[data-cucumber='screen-user-ride']"
    client.waitForExist "[title='To']"
    @TestHelper.screenShot("DriveConfirm.png");
    client.click "[data-cucumber='confirm-ride']"


  @Then /^user "([^"]*)" gets confirmation and sends message "([^"]*)"$/, (username, text)->
    @TestHelper.urlLogin("/loginUsername", username);
    client.url(url.resolve(process.env.ROOT_URL, "/notifications"));
    client.waitForExist "[data-cucumber='review-confirmed']"
    client.click "[data-cucumber='review-confirmed']"
    @TestHelper.screenShot("ReviewConfirmed.png");
    client.waitForExist "[data-cucumber='chat']"
    client.click "[data-cucumber='chat']"
    client.waitForExist("[data-cucumber='chat-input']")
    @TestHelper.screenShot("Chat.png");
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
