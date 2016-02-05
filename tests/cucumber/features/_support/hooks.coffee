module.exports = ()->
  @Before   ->
    console.log '###', 'User creation should be called once'
    @server.call 'removeUser', 'user1@tiktai.lt'
    @server.call 'addUser', email: 'user1@tiktai.lt'
