class MapComponent
  afterShowMap = new ParallelQueue(@);

  constructor: () ->
    @mapCenter = [25.280685, 54.682106]

  showMap: (id)->
    googleServices.afterInit ()=>
      mapElement = document.getElementById(id)
      myOptions =
        zoom : 10,
        center : new google.maps.LatLng(@mapCenter[1], @mapCenter[0]),
        mapTypeId : google.maps.MapTypeId.ROADMAP
      @map = new google.maps.Map(mapElement, myOptions);
      #da ['map-component'], "Map created"
      afterShowMap.start();

  pointALoc: afterShowMap.wrap (loc)->
    latlng = googleServices.toLatLng(loc);
    @map.setCenter(latlng);
    #di ['map-component'], "Droping From marker:", latlng
    if not @fromMarker
      #d("Creating from marker");
      pinImage = new google.maps.MarkerImage(
        "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        #"http://chart.googleapis.com/chart?chst=d_simple_text_icon_left&chld=|14|000|wc-male|24|000|FFF",
        new google.maps.Size(30, 24),
        new google.maps.Point(0,0),
        new google.maps.Point(10, 24));
      @fromMarker = new google.maps.Marker
        map: @map,
        position: latlng,
        icon: pinImage,
        draggable:true
      google.maps.event.addListener @fromMarker, 'dragend', (event)->
        # TODO trips should be always present
        cuurentTrip.setFromLatLng(event.latLng);
        mapController.getLatLngAddress event.latLng, (err, address)->
         Session.set("currentAddress", address);
    else
      @fromMarker.setPosition(latlng);

  pointBLoc: afterShowMap.wrap (loc)->
    latlng = googleServices.toLatLng(loc);
    @map.setCenter(latlng);
    #di ['map-component'], "Droping From marker:", latlng
    if not @toMarker
      #d("Creating from marker");
      pinImage = new google.maps.MarkerImage(
        "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
        #"http://chart.googleapis.com/chart?chst=d_simple_text_icon_left&chld=|14|000|wc-male|24|000|FFF",
        new google.maps.Size(30, 24),
        new google.maps.Point(0,0),
        new google.maps.Point(10, 24));
      @toMarker = new google.maps.Marker
        map: @map,
        position: latlng,
        icon: pinImage,
        draggable:true
      google.maps.event.addListener @toMarker, 'dragend', (event)->
        # TODO trips should be always present
        currentTrip.setToLatLng(event.latLng);
    else
      @toMarker.setPosition(latlng);

  # Might be that no need for map - just google ini
  getTripPath: afterShowMap.wrap (trip, cb)->
    result = {}
    da ['map-component','get-path'], "Calculating path for:"+trip
    request = travelMode: google.maps.TravelMode[(if "rider" is trip.role then "TRANSIT" else "DRIVING")]
    if trip.fromLoc and trip.toLoc
      request.origin = new google.maps.LatLng(trip.fromLoc[1], trip.fromLoc[0])
      request.destination = new google.maps.LatLng(trip.toLoc[1], trip.toLoc[0])
      da(['map-component','get-path'], "Created request from locs:",request);
    else if trip.fromLatLng and trip.toLatLng
      request.origin = trip.fromLatLng
      request.destination = trip.toLatLng
      da(['map-component','get-path'], "Created request from latlng:",request);
    else
      da(['map-component','get-path'], "No locations found for:"+trip);
      return cb?("No locations found for:" + trip, null)

    da(['map-component', 'get-path'], "Getting path:"+trip);
    googleServices.getDirections().route request, (error, result) ->
      da(['map-component', 'get-path'], "Directions returned:"+trip, result);
      unless error
        encodedPoints = result.routes[0].overview_polyline
        #da(['map-component', 'async-capsule', 'get-path'], "Encoded path:"+encodedPoints, request);
        cb?(null, encodedPoints)

  drawActiveTrip: afterShowMap.wrap (trip, options)->
    da ['map-component'], "Draw active trip:", trip
    result = points: []
    if trip.path and trip.toLoc and trip.fromLoc
      da ["async-capsule","trips-drawing"], "Drawing trip path:" + trip
      decodedPoints = google.maps.geometry.encoding.decodePath(trip.path)
      fromLatLng = new google.maps.LatLng(trip.fromLoc[1], trip.fromLoc[0])
      toLatLng = trip.toLoc and new google.maps.LatLng(trip.toLoc[1], trip.toLoc[0])

      #d("Decoded points:", decodedPoints);
      result.line = new google.maps.Polyline(_.extend(
        clickable: true
        map: @map
        path: decodedPoints

        #strokeColor: '#0000FF',
        strokeColor: "SteelBlue"
        strokeOpacity: 0.5
        strokeWeight: 3
      , options))
      result.points[0] = new google.maps.Marker
        map: @map
        position: fromLatLng
        draggable: false
        icon: new google.maps.MarkerImage("/img/red-dot-small.png", new google.maps.Size(9, 9), new google.maps.Point(0, 0), new google.maps.Point(0, 0))
      result.points[1] = new google.maps.Marker
        map: @map
        position: toLatLng
        draggable: false
        icon: new google.maps.MarkerImage("/img/green-dot-small.png", new google.maps.Size(9, 9), new google.maps.Point(0, 0), new google.maps.Point(5, 5))

  zoomForTrips: afterShowMap.wrap (trips)->
    da ['map-component'], "Zoom for trips:", trips

  #Wrapping googleServices method as it requires map to be initialized
  addAutocomplete: (input, cb) ->
    # Requires access to this so run instead of wrap is used
    afterShowMap.run ()=>
      googleServices.addAutocomplete(input, @map, cb);

@mapComponent = new MapComponent();
