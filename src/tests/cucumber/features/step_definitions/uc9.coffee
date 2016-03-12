d = console.log.bind @, "---"

module.exports = ()->

  @Given /^Notifications for "([^"]*)" removed$/, (user)->
    #d "Remove old trips"
    server.call "removeNotifications", user

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
