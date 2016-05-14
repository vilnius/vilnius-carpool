# console.log 'Tiny tests'

loadGoogle = (cb)->
  $.ajax
    #url: 'https://apis.google.com/js/client.js?onload=handleClientLoad'
    url: "http://www.google.com/jsapi?onload=handleClientLoad"
    dataType: 'script'
    success: ->
      google.load "maps", "3",
        other_params: "libraries=geometry,places",
        callback: cb
      return
    error: (e) ->
      #console.log 'Error'
      return
    async: true

Tinytest.addAsync "CarpooService - getTripPath ", (test, done) ->
  # url = window.location.origin+"/download/product-images.html"
  loadGoogle ()->
    googleServices.init();
    trip =
      toLoc : [25.26246500000002, 54.6779097]
      fromLoc : [25.305228100000022,54.6877209]
    carpoolService.getTripPath trip, (err, route)->
      console.log "Got result:", route
      done();
