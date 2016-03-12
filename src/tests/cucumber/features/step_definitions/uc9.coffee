d = console.log.bind @, "---"

module.exports = ()->

  @Given /^Notifications for "([^"]*)" removed$/, (user)->
    #d "Remove old trips"
    server.call "removeNotifications", user

  @Then /^User "([^"]*)" gets notification$/, (username)->
    @TestHelper.login(username);
    client.waitForExist ".selectNotification"
    client.click ".selectNotification"
    client.waitForExist ".requestRide"
    client.click ".requestRide"
