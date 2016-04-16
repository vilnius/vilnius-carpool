###
Creates prerequisites for all tests
depends on the fixtures package cucumber-fixtures
###
module.exports = ()->
  @Before   ->
    #console.log '###', 'User creation should be called once'
    @server.call 'assureUser', {email: 'user1@tiktai.lt'}, {profile: {name: "Ron"}}
    @server.call 'assureUser', {email: 'user2@tiktai.lt'}, {profile: {name: "Dick"}}
