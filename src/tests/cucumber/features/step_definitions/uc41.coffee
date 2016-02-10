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
