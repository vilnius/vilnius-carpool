assert = require('assert')
{CarpoolClient} = require('../lib/carpool-client-ddpjs')
sockjs = require('sockjs-client');

d = console.log.bind console

describe 'Carpool client', ->
  describe '#authenticate', ->
    it 'should return user', ()->
      client = new CarpoolClient(sockjs);
      client.connect().then ()->
        d "Connected"
        client.authenticate("ron@tiktai.lt", "aaa")
