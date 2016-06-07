d = console.log.bind @, "---"

url = require('url');

module.exports = ()->
  @Given /^Messages removed$/, ()->
    #d "Remove old trips"
    server.call "removeMessages", "ron@tiktai.lt"
    server.call "removeMessages", "dick@tiktai.lt"

  @When /^I send messsage "([^"]*)" to "([^"]*)"$/, (message, cdUser)->
    called = server.call "getUser", cdUser
    #d "Navigate to #{cdUser} chat /m/your/chat/", called
    client.url(url.resolve(process.env.ROOT_URL, "/m/your/chat/#{called._id}"));
    client.waitForExist("[data-cucumber='chat-input']")
    #d "Enter text #{message} for #{cdUser}"
    client.setValue("input[id='chatInput']", message)
    client.keys("Enter");

  @Then /^"([^"]*)" gets message "([^"]*)" from "([^"]*)"$/,  (cdUser, message, cgUser)->
    d "See text #{message} for #{cdUser}"
    @TestHelper.urlLogin("/loginUsername", cdUser);
    calling = server.call "getUser", cgUser
    client.url(url.resolve(process.env.ROOT_URL, "/m/your/chat/#{calling._id}"));
    client.waitForExist("[data-cucumber='chat-input']")
