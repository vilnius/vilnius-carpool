assert = require('assert')
CarpoolClient = require('../lib/carpool-client-ddpjs')
sockjs = require('sockjs-client');
_ = require('underscore')

d = console.log.bind console

describe 'Carpool client', ->
  userId = null

  before ()->
    # Client here is DDP client implementation
    @client = new CarpoolClient(sockjs);
    @client.connect()

  # "{"msg":"method","method":"createUser","params":[{"email":"user2@tiktai.lt","password":{"digest":"7a345ba5e18955831fb1f543443b78bac5a823eeb8d5747e8fcb2c5591b31313","algorithm":"sha-256"},"password2":"12qwaszx","errorSnackbarMessage":"","errorSnackbarOpen":false}],"id":"3"}"
  describe 'register user', ->
    it 'should return user id', ->
      @client.call "createUser", email: "user#{Math.random()*1000}@tiktai.lt", password: "password12"

  describe 'authenticate with correct credentials', ->
    it 'should return user id', ()->
      username = "ron@tiktai.lt"
      password = "aaa"
      # assume this is any other language DDP client implementation
      @client.call("login", { user : { email : username }, password : password })
      .then (response)=>
        # d "Got user #{response.result.id}", result,
        assert.ok(response.id)
        userId = response.result.id

  describe 'saving location', ->
    it 'should return that location in 2nd subscribtion callback', (done)->
      # d "User Id:", userId
      location = [25.272159576416016, -90+Math.random()*180]
      @client.subscribe "locations", userId, _.after 2, (message)->
        assert.deepEqual(location, message.fields.loc)
        done();
      @client.call "saveLocation", location
      return
