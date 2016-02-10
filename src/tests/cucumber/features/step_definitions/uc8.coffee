d = console.log.bind @, "---"

module.exports = ()->

  @Given /^Trip removed$/, ()->
    d "Remove old trips"
    server.call "removeTrips", "user1@tiktai.lt"
