Meteor.startup () =>
  #da(['geoloc'], "Getting current location");
  if "geolocation" of navigator
    #d("Geolocation is available");
    navigator.geolocation.getCurrentPosition (location) ->
      #latlng = new google.maps.LatLng(location.coords.latitude, location.coords.longitude)
      da ['geoloc'], "Setting location:", location.coords
      Session.set("geoIpLoc", [location.coords.longitude, location.coords.latitude]);
    , ()->
      da ['geoloc'], "Geolocation error:", arguments

  if Meteor.isCordova

    saveLocation = (location)->
      da ['geoloc'], "Got cordova location:", location
      Locations.insert
        tsi: new Date(location.timestamp)
        userId: Meteor.userId()
        loc: [location.coords.longitude, location.coords.latitude]
        acc: location.coords.accuracy

    geoError = ()->
      da ['geoloc'], "Geolocation error:", arguments

    watchId = navigator.geolocation.watchPosition saveLocation, geoError,
      timeout: 30000,
      maximumAge: 3000,
      enableHighAccuracy: true
      
    # GeolocationFG.get saveLocation
    # watchId = GeolocationFG.watch saveLocation, 30000,
    #   maximumAge: 3000,
    #   enableHighAccuracy: true
