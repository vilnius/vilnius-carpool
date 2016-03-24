Meteor.startup () =>
  #da(['geoloc'], "Getting current location");
  if "geolocation" of navigator
    #d("Geolocation is available");
    navigator.geolocation.getCurrentPosition (location) ->
      #latlng = new google.maps.LatLng(location.coords.latitude, location.coords.longitude)
      da ['geoloc'], "Setting location:", location.coords
      Session.set("geoIpLoc", [location.coords.longitude, location.coords.latitude]);

  if Meteor.isCordova

    GeolocationFG.get (location)->
      da ['geoloc'], "Setting cordova location:", location.coords

    GeolocationCallback = (location)->
      da ['geoloc'], "Watching cordova location:", location.coords

    watchId = GeolocationFG.watch GeolocationCallback, 30000,
      maximumAge: 3000,
      enableHighAccuracy: true
