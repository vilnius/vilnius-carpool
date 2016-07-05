d = console.log.bind @, "---"

url = require('url');

module.exports = ()->


  @Then /^User "([^"]*)" gets notification and sends request$/, (username)->
    @TestHelper.login(username);
    client.waitForExist ".selectNotification"
    client.click ".selectNotification"
    client.waitForExist ".requestRide"
    client.click ".requestRide"

  @Then /^user "([^"]*)" aproves request$/, (username)->
    @TestHelper.login(username);
    client.waitForExist ".showMyTrip"
    client.click ".showMyTrip"
    client.waitForVisible ".acceptRequest"
    client.click ".acceptRequest"

  @Then /^User "([^"]*)" gets mobile notification and sends request$/, (username)->
    #client.saveScreenshot('../build/screenshots/uc9-driverTrip.png')
    @TestHelper.login(username);
    client.url(url.resolve(process.env.ROOT_URL, "/notifications"));
    #client.saveScreenshot('../build/screenshots/uc9-notifications.png')
    client.waitForExist ".selectNotification"
    client.click ".selectNotification"
    client.waitForExist ".requestRide"
    #client.saveScreenshot('../build/screenshots/uc9-showRide.png')
    client.click ".requestRide"
    client.waitForExist ".cancelRequest"

  @Then /^user "([^"]*)" aproves request on mobile$/, (username)->
    @TestHelper.login(username);
    client.url(url.resolve(process.env.ROOT_URL, "/notifications"));
    # TODO check is notification correct
    client.waitForExist ".selectNotification"
    client.click ".selectNotification"
    client.waitForVisible ".acceptRequest"
    #client.saveScreenshot('../build/screenshots/uc9-acceptRequest.png')
    client.click ".acceptRequest"

  @Then /^user "([^"]*)" sees pickup stop$/, (username)->
    @TestHelper.login(username);
    client.url(url.resolve(process.env.ROOT_URL, "/notifications"));
    client.waitForExist ".selectNotification"
    client.click ".selectNotification"
