reactivate = (obj, property)->
  depName = 'dep'+ (property[0].toUpperCase() + property[1..-1].toLowerCase())
  obj.prototype[depName] = new Tracker.Dependency;
  getterName = 'get'+ (property[0].toUpperCase() + property[1..-1].toLowerCase())
  obj.prototype[getterName] = new Function("", 'this["'+depName+'"].depend(); return this["'+property+'"];');
  setterName = 'set'+ (property[0].toUpperCase() + property[1..-1].toLowerCase())
  obj.prototype[setterName] = new Function("value", 'this["'+depName+'"].changed(); return this["'+property+'"]=value;');

class Location
  address: null
  latlng: null;

reactivate(Location, "latlng");
reactivate(Location, "address");

# TODO merge with mapView functions
class @Progress
  progress: {}
  setProgress: (action, progress)->
    if progress == 100
      delete @progress[action]
    else
      @progress[action] = progress
    @getProgress();
  getProgress: ()->
    sum = 0
    total = 0
    _.each @progress, (item) ->
      sum += item
      total += 100
    if sum == 0
      if total == 0
        return 100;
      else
        return 0;
    else
      return sum / total
  isReady: ()->
    return getProgress == 0

class CarpoolTrip
  time: new Date();
  from: new Location
  to: new Location

  getTime: () ->
    return @time

class MapView
  afterMapShown = new ParallelQueue(@);
  trip: new CarpoolTrip();
  toMarker: null;
  fromMarker: null;
  stops: []
  activeTrips: {}
  ownTrips: {}
  progress: new Progress();

  ###
  Shows Google Map when all required libraries are ready and starts afterMapShown queue
  ###
  showMap: (id, cb)->
    mapElement = document.getElementById(id);
    #d "This method is called after google services are initialized"
    googleServices.afterInit =>
      myOptions =
        zoom: 12
        center: new (google.maps.LatLng)(54.67704, 25.25405)
        mapTypeId: google.maps.MapTypeId.ROADMAP
      @map = new (google.maps.Map)(mapElement, myOptions)
      cb(null, @map);
      da ["stops-drawing"], "Map is shown"
      afterMapShown.purge ()->
        #da ["stops-drawing"], "Map is shown"
  ###
  Automcomplete requires map to be initialized
  ###
  addAutocomplete: afterMapShown.wrap (input, cb)->
    googleServices.addAutocomplete input, @map, cb
  ###
  @Deprecated
  Form adress
  ###
  formAddress: (place)->
    if place.address_components
      address = [
        place.address_components[0]?.short_name or ""
        place.address_components[1]?.short_name or ""
        place.address_components[2]?.short_name or ""
      ].join(" ")
      #da ["trips-filter"], "Formed address #{address} from:", place
      return address
    else
      #da ["trips-filter"], "Couldn't form address", place
      return ""
  ###
  Set current trip
  ###
  setCurrentTrip: afterMapShown.wrap (loadedTrip, cb)->
    return unless loadedTrip
    #da ["read-trip"], "Loaded trip", trip
    #@trip = new CarpoolTrip();
    toLatlng = googleServices.toLatLng(loadedTrip.toLoc)
    @trip.path = loadedTrip.path
    @trip.toLoc = loadedTrip.toLoc
    @trip.to.setLatlng(toLatlng)
    @trip.to.setAddress(loadedTrip.toAddress);
    fromLatlng = googleServices.toLatLng(loadedTrip.fromLoc)
    @trip.fromLoc = loadedTrip.fromLoc
    @trip.from.setLatlng(fromLatlng);
    @trip.from.setAddress(loadedTrip.fromAddress);
    @drawOwnTrip @trip
    cb?(null, @trip);
  ###
  @Deprecated moved to CarpoolServiceClient
  Geolocate more details about location
  ###
  clarifyPlace: (latlng, address, cb)->
    query = {}
    if latlng? and address?
      cb(null, latlng, address)
      return
    if not latlng? and address? then query = 'address': address
    if latlng? and not address? then query = 'latLng': latlng
    da ["trips-filter"], "Clarify place:", query
    googleServices.getGeocoder().geocode query, (error, result)=>
      if !error and result.length > 0
        cb?(null, result[0].geometry.location, @formAddress(result[0]))
      else
        cb?(error)
  ###
  The new trip destination
  ###
  setCurrentTripTo: (err, latlng, address, place, cb)=>
    da ["trips-filter"], "Set current trip to", address, latlng
    setToLatLng = (refinedLatlng, refinedAddress)=>
      @trip.to.setLatlng(refinedLatlng)
      @trip.to.address = refinedAddress
      @dropToMarker @trip.to.latlng
      cb? refinedLatlng, refinedAddress
    @clarifyPlace latlng, address, (err, refinedLatlng, refinedAddress)=>
      da ["trips-drawing", "trips-filter"], "Refined latlng #{refinedAddress}:", refinedLatlng,
      setToLatLng(refinedLatlng, refinedAddress) unless err
  ###
  Show 'to' marker on map
  ###
  dropToMarker: (latlng)->
    if not @toMarker
      pinImage = new (google.maps.MarkerImage)('http://maps.google.com/mapfiles/ms/icons/green-dot.png', new (google.maps.Size)(32, 32), new (google.maps.Point)(0, 0), new (google.maps.Point)(16, 32))
      @toMarker = new (google.maps.Marker)(
        map: @map
        position: latlng
        icon: pinImage
        draggable: true)
      google.maps.event.addListener @toMarker, 'dragend', (event)->
        updateUrl("bLoc", event.latLng);
    else
      @toMarker.setPosition(latlng);
  ###
  The new trip origin
  ###
  setCurrentTripFrom: (err, latlng, address, place, cb)=>
    #d "Set current trip to", address
    setFromLatLng = (refinedLatlng, refinedAddress)=>
      #d "Refine latlng", refinedLatlng
      @trip.from.setLatlng(refinedLatlng)
      @trip.from.address = refinedAddress
      @dropFromMarker @trip.from.latlng
      cb? refinedLatlng, refinedAddress
    @clarifyPlace latlng, address, (err, refinedLatlng, refinedAddress)=>
      setFromLatLng(refinedLatlng, refinedAddress) unless err
  ###
  Show 'from' marker on map
  ###
  dropFromMarker: (latlng)->
    if not @fromMarker
      pinImage = new (google.maps.MarkerImage)('http://maps.google.com/mapfiles/ms/icons/red-dot.png', new (google.maps.Size)(32, 32), new (google.maps.Point)(0, 0), new (google.maps.Point)(16, 32))
      @fromMarker = new (google.maps.Marker)(
        map: @map
        position: latlng
        icon: pinImage
        draggable: true)
      google.maps.event.addListener @fromMarker, 'dragend', (event)->
        updateUrl("aLoc", event.latLng);
    else
      @fromMarker.setPosition(latlng);
  ###
  Draw stops on the map
  ###
  showStops: afterMapShown.wrap (stops, stopsOnRoutes) ->
    #da ["stops-drawing"], "Stops", stops
    for i, stop of stops
      #da ["stops-drawing"], "Show stop", stop
      if stopsOnRoutes?[stop._id]?
        img = "/img/yellow-stop.png"
      else
        img = '/img/white-stop.png';
      @stops[i] = new (google.maps.Marker)(
        map: @map
        position: googleServices.toLatLng stop.loc
        draggable: false
        title: stop.title
        icon: new (google.maps.MarkerImage)(img,
          new (google.maps.Size)(11, 11),
          new (google.maps.Point)(0, 0),
          new (google.maps.Point)(6, 6)))
  ###
  Highlights the trip
  ###
  selectTrip: (trip)->
    return unless trip?
    tripId = trip._id
    @selectedTrip = tripId
    if @activeTrips[tripId]?
      da ["trips-matcher"], "Higlight only drawn trip #{tripId}"
      mapTrip = @activeTrips[tripId]
      @removeTrip mapTrip
      @drawTrip trip, {strokeColor: 'yellow', strokeOpacity: 1}, (err, mapTrip)=>
        @activeTrips[trip._id] = mapTrip
  ###
  Removes the trip from map
  ###
  removeTrip: (trip)->
    da ['trips-drawing'], "Removing trip", trip
    trip.line.setMap(null);
    for point in trip.points
      point.setMap(null)
  ###
  Puts markers and decoded points on the map
  ###
  drawTrip: afterMapShown.wrap (trip, options, cb) ->
    result =
      points: []
    da ['trips-drawing'], 'Drawing trip:', trip, options
    if trip.path and trip.toLoc and trip.fromLoc
      decodedPoints = google.maps.geometry.encoding.decodePath(trip.path)
      fromLatLng = googleServices.toLatLng trip.fromLoc
      toLatLng = googleServices.toLatLng trip.toLoc
      #d("Decoded points:", decodedPoints);
      result.line = new (google.maps.Polyline)(_.extend({
        clickable: true
        map: @map
        path: decodedPoints
        strokeColor: 'SteelBlue'
        strokeOpacity: 0.5
        strokeWeight: 3
      }, options))
      result.points[0] = new (google.maps.Marker)(
        map: @map
        position: fromLatLng
        draggable: false
        icon: new (google.maps.MarkerImage)('/img/red-dot-small.png',
          new (google.maps.Size)(9, 9),
          new (google.maps.Point)(0, 0),
          new (google.maps.Point)(4, 4)))
      result.points[1] = new (google.maps.Marker)(
        map: @map
        position: toLatLng
        draggable: false
        icon: new (google.maps.MarkerImage)('/img/green-dot-small.png',
          new (google.maps.Size)(9, 9),
          new (google.maps.Point)(0, 0),
          new (google.maps.Point)(4, 4)))
      cb and cb(null, result)
    else
      da ['veiwport-map'], 'Can\'t draw - path is not decoded: ' + trip
      cb? "No path", null
  ###
  Draws active trip
  ###
  drawOwnTrip: afterMapShown.wrap (trip, cb) ->
    if @ownTrips[trip._id]?
      @removeTrip @ownTrips[trip._id]
    @drawTrip trip, strokeColor: 'Red', (err, mapTrip)=>
      @ownTrips[trip._id] = mapTrip
      cb(err, mapTrip);
  ###
  Removes the trips not present in set
  ###
  invalidateOwnTrips: (set)->
    oldTrips = _(@ownTrips).keys()
    purge = _.difference(oldTrips,set)
    for key in purge
      @removeTrip(@ownTrips[key])
  ###
  Draws active trip
  ###
  drawActiveTrip: afterMapShown.wrap (trip, cb) ->
    if @activeTrips[trip._id]?
      @removeTrip @activeTrips[trip._id]
    @drawTrip trip, strokeColor: 'SteelBlue', (err, mapTrip)=>
      @activeTrips[trip._id] = mapTrip
      cb(err, mapTrip);
  ###
  Removes the trips not present in set
  ###
  invalidateActiveTrips: (set)->
    oldTrips = _(@activeTrips).keys()
    purge = _.difference(oldTrips,set)
    for key in purge
      @removeTrip(@activeTrips[key])
  ###
  Progress bar reset
  ###
  resetActionProgress: ->
    @progress = new Progress();
    NProgress.done()
  ###
  Set progress bar values
  ###
  setActionProgress: (action, value) ->
    NProgress.set @progress.setProgress(action, value)

  getActionProgress: () ->
    @progress.getProgress();


@mapView = new MapView

###
  Meteor templates for UI
###
Template.MapView.rendered = ->
  #d "Stops admin rendered"
  mapView.showMap "map_canvas", (err, map)=>
    #d "Stops might not be loaded", @data
