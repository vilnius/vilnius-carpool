d = console.log.bind @, "---"

module.exports = ()->
  url = require('url');
#_ = require('underscore');

  @Given /^I am logged off$/, ()->
    client.url(url.resolve(process.env.ROOT_URL, "/"));
    client.waitForExist('#left-panel');
    if client.isVisible('.profile-form')
      client.click(".showLogout");
      client.waitForVisible('.logout');
      client.click(".logout");

  @When /^Login with "([^"]*)"$/, (username)->
    @TestHelper.login(username)

  @Then /^I see "([^"]*)" text "([^"]*)"$/, (element, text)->
    client.waitForExist(element);
    expect(client.getText(element)).toEqual(text)

  @Then /^I see "([^"]*)"$/, (element)->
    d "Wait for exist #{element}"
    client.waitForExist(element);
    d "Found #{element}"

  @Then /^I See "([^"]*)" in "([^"]*)"$/, (element, path)->
    link = process.env.ROOT_URL + path;
    d "Link to create evaluation #{link}"
    client.url(link);
    client.waitForExist(element);

  @When /^I enter:$/, (messages)->
    #d "Enter", messages
    for key, value of messages.hashes()[0]
      d "Fill #{key}=#{value}"
      client.setValue("input[id=\"#{key}\"]", value);
      client.keys("Enter");


  @When /Click on "([^]*)"/, (button)->
    d "Clicking #{button}"
    client.click button

  @When /^Type "([^]*)$"/, (text)->
    client.keys(text);
