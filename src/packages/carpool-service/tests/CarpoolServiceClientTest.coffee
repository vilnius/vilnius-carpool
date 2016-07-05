# console.log 'Tiny tests'
d = console.log.bind console
carpoolService = undefined;

loadGoogle = (cb)->
  $.ajax
    #url: 'https://apis.google.com/js/client.js?onload=handleClientLoad'
    url: "http://www.google.com/jsapi?onload=handleClientLoad"
    dataType: 'script'
    success: ->
      d "Google key:", Meteor.settings.public.googleApi.key
      carpoolService = new CarpoolService {key: Meteor.settings.public.googleApi.key}
      # google.load "maps", "3",
      #   other_params: "libraries=geometry,places&key=AIzaSyC4jEbNbglLxwxH7_gcmDMxWxwYOAPVVJM",
      # callback: cb
    error: (e) ->
      console.warn 'Error', e
    async: true

loadGoogle();

Tinytest.addAsync "CarpooService - getTripPath ", (test, done) ->
  # url = window.location.origin+"/download/product-images.html"
  googleServices.afterInit ()->
    # googleServices.init({key: "AIzaSyC4jEbNbglLxwxH7_gcmDMxWxwYOAPVVJM"});
    trip =
      toLoc : [25.26246500000002, 54.6779097]
      fromLoc : [25.305228100000022,54.6877209]
      bTime: new Date()
    d "Calling get trip path"
    carpoolService.getTripPath trip, (err, route)->
      console.log "Got result:", route
      done();
