d = console.log.bind @, "---"

module.exports = ()->

  @Given /^Admin exists$/, ()->
    d "Create admin"
    server.call "assureUser", {
      email: 'admin@tiktai.lt'
      profile:
        name: 'Admin'
    },
      roles: ['root']

  @Given /^Stop "([^"]*)" is created$/, (stopTitle)->
    server.call "assureStop", stopTitle
