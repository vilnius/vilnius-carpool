d = console.log.bind @, "---"

module.exports = ()->

  @Given /^Notifications for "([^"]*)" removed$/, (user)->
    #d "Remove old trips"
    server.call "removeNotifications", user

  @Then /^User "([^"]*)" get notification$/, (username)->
    @TestHelper.login(username)
