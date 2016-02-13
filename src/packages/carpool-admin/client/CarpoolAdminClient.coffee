class CarpoolAdmin

  createStop:(map, location) ->
    pinImage = new (google.maps.MarkerImage)(
      'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
      new (google.maps.Size)(32, 32),
      new (google.maps.Point)(0, 0), new
      (google.maps.Point)(16, 32));
    toMarker = new (google.maps.Marker)(
      map: map
      position: location
      icon: pinImage
      draggable: true)
    Stops.insert loc: googleServices.toLocation location

@carpoolAdmin = new CarpoolAdmin
