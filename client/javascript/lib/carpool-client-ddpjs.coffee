DDP = require("ddp.js");
URL = require('url');

d = console.log.bind console

module.exports = class @CarpoolClient
  constructor: (@socket)->
    
  ###
  # Connect to the Meteor Server
  ###
  connect: (urlString = "http://localhost:3000/sockjs")->
    options =
      endpoint: urlString,
      SocketConstructor: @socket
    @ddp = new DDP.default(options);

    new Promise (resolve, reject) =>
      @ddp.on "connected", ()->
        resolve();

  authenticate: (username, password)->
    new Promise (resolve, reject) =>
      methodId = @ddp.method "login", [
        { user : { email : username }, password : password }
      ]
      @ddp.on "result", (message)->
        if message.id is methodId && !message.error
          resolve(message)
        else
          reject(message.error)
