DDPClient = require('ddp')
URL = require('url');
Random = require('ddp-random')

d = console.log.bind console

class @CarpoolClient
  constructor: (urlString = "ws://localhost:3000/sockjs/658/asnhd6g1/websocket")->
    url = new URL.parse(urlString);
    @ddpclient = new DDPClient
      host: url.hostname
      port: url.port
      ssl: false
      autoReconnect: true
      autoReconnectTimer: 500
      maintainCollections: true
      ddpVersion: '1'
      useSockJs: true
      url: urlString

  ###
  # Connect to the Meteor Server
  ###
  connect: ->
    new Promise (resolve, reject) =>
      # d "Connecting"
      @ddpclient.connect (error, wasReconnect) ->
        # d "Connected", error, wasReconnect
        if error then reject(error) else resolve(wasReconnect)

  authenticate: (username, password)->
    new Promise (resolve, reject) =>
      @ddpclient.call "login", [
        { user : { email : username }, password : password }
      ], (error, result)->
        if error then reject(error) else resolve(result)
