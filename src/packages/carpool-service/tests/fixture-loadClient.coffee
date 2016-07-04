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

@loadClient = (cb)->
  loadGoogle ()->
    googleServices.init({key: "asas"});
    cb();
