module.exports = ()->
  @Before   ->
    console.log '###', 'User creation should be called once'
    @server.call 'assureUser', email: 'user1@tiktai.lt'
