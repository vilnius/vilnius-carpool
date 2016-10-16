assert = require('assert')
CarpoolClient = require('../lib/carpool-client-ddpjs')
sockjs = require('sockjs-client');

d = console.log.bind console

describe 'Carpool client', ->
  before ()->
    # Client here is DDP client implementation
    @client = new CarpoolClient(sockjs);
    @client.connect()

  describe 'authenticate with correct credentials', ->
    it 'should return user id', ()->
      username = "ron@tiktai.lt"
      password = "aaa"
      # assume this is any other language DDP client implementation
      @client.call("login", { user : { email : username }, password : password })
      .then (result)->
        assert.ok(result.id)
