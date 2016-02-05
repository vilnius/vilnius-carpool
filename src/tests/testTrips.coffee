#tests/posts.coffee
assert = require 'assert'

suite 'Trips', ->
  test 'in the server', (done, server, client) ->
    client.eval ->
      mock "Info"
      new MockClass('Info');
      new MockTrip({});
      new Trip({});
      #new Trip({});
      emit 'docs'
    client.once 'docs', ->
      done()