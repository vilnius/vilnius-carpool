###
Creates prerequisites for all tests
depends on the fixtures package cucumber-fixtures
###
module.exports = ()->
  @Before   ->
    #console.log '###', 'User creation should be called once'
    @server.call 'assureUser', {email: 'ron@tiktai.lt'}, {profile: {name: "Ron", avatar: "/packages/cucumber-fixtures/public/ron.jpg"}}
    @server.call 'assureUser', {email: 'dick@tiktai.lt'}, {profile: {name: "Dick", avatar: "/packages/cucumber-fixtures/public/dick.jpg"}}
