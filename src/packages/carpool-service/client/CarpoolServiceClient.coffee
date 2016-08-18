{ ParallelQueue } = require 'meteor/spastai:flow-controll'
moment = require 'moment'

tripsHistoryPeriod = Meteor.settings.public.tripsHistoryPeriod || 1000 * 60 * 60 * 24 * 60

class @CarpoolService
  preInitQueue = new ParallelQueue(@);

  stopRadiusFromOrig = 1000 * 180 / (3.14 * 6371 * 1000)
  stopDistanceFromRoute = 250 * 180 / (20000 * 1000) # seems it counts double distance
  locRadiusFilter = 1000 * 180 / (3.14 * 6371 * 1000)

  constructor: (@params) ->
    googleServices.init {key: @params.key}
    googleServices.afterInit ()=>
      preInitQueue.start()

  saveFeedback: (message)->
    Feedback.insert({text:message, userId: Meteor.userId()});

  sendMessage: (to, message)->
    Meteor.call("sendMessage", Meteor.userId(), to, message)

  saveSelection: (field, value) ->
    if item = Selections.findOne {
      user: Meteor.userId(),
      field: field,
      "value.description": value.description
    }
      Selections.update item._id, { $set:
        time: new Date().getTime()
      }
    else
      if value.latlng
        value.loc = googleServices.toLocation(value.latlng)
      Selections.insert
        user: Meteor.userId(),
        field: field,
        value: value,
        time: new Date().getTime()

  favoriteSelections: (field) ->
    Selections.find({
      user: Meteor.userId(),
      field: field
    } , {
      limit: 5
    }).map (item)->
      if item.value.loc?
        item.value.latlng = googleServices.toLatLng(item.value.loc);
      return item.value

  currentLocation: (cb)->
    if "geolocation" of navigator
      #d "Geolocation is available"
      navigator.geolocation.getCurrentPosition (location) ->
        cb null, [location.coords.longitude, location.coords.latitude]
      , (positionError)->
        cb positionError
    else
      cb "No geolocation found in browser navigator"

  encodePoints: preInitQueue.wrap (loc, cb) ->
    cb(googleServices.encodePoints(loc));

  resolveLocation: preInitQueue.wrap (loc, address, cb) ->
    #console.log("Resolve location", loc, address);
    if undefined == loc
      return null
    latlng = googleServices.toLatLng(loc)
    carpoolService.clarifyPlace latlng, address, (error, newCoords, newAddress) ->
      #console.log(address, "resolved", newAddress)
      cb newAddress

  formAddress: (place)->
    if place.address_components
      address = [
        place.address_components[0]?.short_name or ""
        place.address_components[1]?.short_name or ""
        #place.address_components[2]?.short_name or ""
      ].join(" ")
      #da ["trips-filter"], "Formed address #{address} from:", place
      return address
    else
      #da ["trips-filter"], "Couldn't form address", place
      return ""

  geocode: preInitQueue.wrap (query, cb)->
    googleServices.getGeocoder().geocode(query, cb)

  clarifyPlace: (latlng, address, cb) ->
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
  Saves trip
  ###
  saveTrip: (trip, callback) ->
    fromLatLng = if trip.fromLoc then googleServices.toLatLng(trip.fromLoc)
    toLatLng = if trip.toLoc then googleServices.toLatLng(trip.toLoc)
    da(["trip-crud"], "Saving trip", trip)
    @clarifyPlace fromLatLng, trip.fromAddress, (err, latlng, address) =>
      da(["trip-crud"], "Clarified A: #{trip.fromAddress}", latlng)
      return callback "Can't clarify A" unless latlng
      trip.fromLoc = googleServices.toLocation(latlng)
      @clarifyPlace toLatLng, trip.toAddress, (err, latlng, address) =>
        return callback "Can't clarify B" unless latlng
        trip.toLoc = googleServices.toLocation(latlng)
        @getTripPath trip, (err, route) ->
          if err then return callback(err)
          _(trip).extend route
          # meanwhile only arrival time is accepted
          da ["trip-crud"], "Arival time:", trip.bTime.getTime()
          trip.aTime = moment(trip.bTime).subtract(route.duration, 'seconds').toDate();
          Meteor.call 'saveTrip', trip, (error, result) ->
            trip._id  = result
            callback error, trip

  ###
  Removes own trip
  ###
  removeTrip: (_id, callback) ->
    Meteor.call 'removeTrip', _id, (error, result) ->
      callback?(error, result)

  ###
  Sends request for trip owner
  ###
  requestRide: (_id, fromLoc, callback) ->
    da [ 'trip-request' ], "Sending request to #{_id}"
    Meteor.call 'requestRide', _id, fromLoc, (error, result) ->
      callback?(error, result)

  ###
  Accepts request
  ###
  acceptRequest: (invitationId, answer, callback) ->
    da [ 'trip-request' ], 'Accepting request'
    Meteor.call 'acceptRequest', invitationId, answer, (error, result) ->
      callback?(error, result)

  ###
  @Deprecated
  From CityTripWorker.getActiveTrips
  ###
  getActiveTrips: ->
    da [ 'active-trips' ], 'Getting city active trips for ' + Meteor.userId()
    now = new Date
    fromTime = new Date(now.getTime() - (1000 * 60 * 60 * 24 * 60))
    filter =
      owner: $ne: Meteor.userId()
      bTime: $gte: fromTime
    Trips.find filter, sort: time: -1

  ###
  New version of getActiveTrips - reactive method to subscribe and find Trips
  TODO for first time function is called 3 times
  ###
  pullActiveTrips: (filter, progress) ->
    @activeTripsSub = Meteor.subscribe('activeTrips', filter)
    da [ 'data-publish' ], '1. Subscribing for active trips:' + Meteor.userId(), filter
    if @activeTripsSub.ready()
      progress 100
    else
      progress 0
      return []

    now = new Date
    fromTime = new Date(now.getTime() - (tripsHistoryPeriod))
    query = _(filter).chain().omit("fromLoc", "toLoc").extend(
      owner: $ne: Meteor.userId()
      bTime: $gte: fromTime
    ).value();
    trips = Trips.find(query, sort: time: -1).fetch()
    #console.log "Active trips filter in client", query, trips
    trips

  ###
  New version of getOwnTrips - reactive method to subscribe and find own Trips
  ###
  pullOwnTrips: (filter, progress) ->
    @ownTripsSub = Meteor.subscribe('ownTrips')
    if @ownTripsSub.ready()
      progress 100
    else
      progress 0
      return []
    now = new Date
    fromTime = new Date(now.getTime() - (1000 * 60 * 60 * 24))
    userId = Meteor.userId() or ''
    query = _(filter).chain().omit("fromLoc", "toLoc").extend(
      #$or: [ { owner: userId } ]
      #owner: userId,
      time: $gte: fromTime).value();

    da ['own-trip-publish'], "Find own trips", query
    cursor = Trips.find(query, sort: time: -1)
    cursor.fetch()

  ###
  Pull one trip - applies restrictions what could be retrieved
  ###
  pullOneTrip: (query, progress) ->
    @oneTripsSub = Meteor.subscribe('oneTrip', query)
    #console.log "Subscribed", query
    if @oneTripsSub.ready()
      progress 100
      da ['one-trip-publish'], "oneTripsSub Ready", query
    else
      progress 0
      da ['one-trip-publish'], "oneTripsSub Subscribed", query
      return null
    Trips.findOne query

  pullStops: (progress) ->
    @stopsSubs = Meteor.subscribe("stops");
    if(@stopsSubs.ready())
      progress 100
    else
      progress 0
      return null
    Stops.find().fetch()

  getStops: ->
    Stops.find().fetch()


  pullRiderItinerary: (ride, drive)->
    itineraryId = if drive then drive._id else "single"
    # d "Check for itinerary in ride", ride, drive
    if ride?.itineraries?[itineraryId]
      # d "Itinerary was in ride", ride
      itinerary = ride?.itineraries[itineraryId]
    else
      itinerary = ItenaryFactory.createRiderItenary(ride, drive);
      # d "Created itinerary without paths", itinerary
      #d("This this add paths to each stops and update ride object triggering screen redraw");
      carpoolService.routeItenary(itinerary).then ()->
        # d "Got itinerary paths", itinerary
        itineraryObj = {};
        itineraryObj[itineraryId] = itinerary;
        ride and Trips.update({_id: ride._id}, {$set: {itineraries: itineraryObj}});
    return itinerary

  pullDriverItinerary: (drive)->
    return unless drive
    # d "Check for itinerary in ride", ride
    if drive.itinerary
      # d "Itinerary was in ride", ride
      itinerary = drive.itinerary
    else
      itinerary = ItenaryFactory.createDriverItenary(drive);
      # d "Created itinerary without paths", itinerary
      # For driver route only a,b points // TODO stops should be ordered by visiting sequence
      [dA, ..., dB] = itinerary
      carpoolService.routeItenary([dA,dB]).then ()->
        # d "Got itinerary paths", itinerary
        Trips.update({_id: drive._id}, {$set: {itinerary: itinerary}});
    return itinerary

  pullTripForRiderPickup: (query, progress) ->
    trip = undefined
    trip = @pullOneTrip(query, mapView.setActionProgress.bind(this, 'oneTrip'))

  ###
  From TripBusinessLogic.getActiveTrips
  ###
  getOwnTrips: ->
    now = new Date
    fromTime = new Date(now.getTime() - (1000 * 60 * 60 * 24))
    userId = Meteor.userId() or ''
    Trips.find
      $or: [ { owner: userId } ]
      time: $gte: fromTime

  ###
  Loads one trip
  ###
  getTrip: (id) ->
    query = _id: id
    Trips.findOne query

  ###
  Route the trip through the stops
  Current algorythm find the stops falling in stopRadiusFromOrig from
  trip start and checks are the on the route
  ###
  getTripPath: (trip, cb) ->
    directTrip = @routeTrip trip, (err, route) =>
      if err
        return cb(err)
      path = route.overview_polyline
      points = route.overview_path
      polyline = new (google.maps.Polyline)(path: points)
      stops = Stops.find({}).fetch()
      #d "Stops to check", stops
      stopOnRoute = [ {
        _id: "stop-a"
        loc: trip.fromLoc
        title: trip.fromAddress
      } ]
      if("driver" == trip.role)
        for stop in stops
          stopLatLng = googleServices.toLatLng(stop.loc)
          if google.maps.geometry.poly.isLocationOnEdge(stopLatLng, polyline, stopDistanceFromRoute)
            stopOnRoute.push stop
      #d "Found stops on route", stopOnRoute
      @routeTrip trip, (err, stopsRoute) ->
        cb null,
          path: stopsRoute.overview_polyline
          stops: stopOnRoute
          duration: stopsRoute.legs[0].duration.value

  routeTrip: (trip, args...)->
    if args.length > 1
      waypoints = args[0]
      cb = args[1]
    else
      cb = args[0]

    result = {}
    da ['async-capsule','map-bridge'], 'Calculating path for:' + trip
    request = travelMode: google.maps.TravelMode[if 'rider' == trip.role then 'TRANSIT' else 'DRIVING']
    if trip.fromLoc and trip.toLoc
      request.origin = googleServices.toLatLng(trip.fromLoc)
      request.destination = googleServices.toLatLng(trip.toLoc)
      request.transitOptions =
        arrivalTime: trip.bTime
    else
      return cb?('No locations found for ' + trip.fromAddress + '-' + trip.toAddress)

    googleServices.getDirections().route request, (error, result) ->
      #d "Directions result", result
      if error
        return cb?(error)
      encodedPoints = result.routes[0].overview_polyline
      cb & cb(null, result.routes[0])

  routeItenary: (itenary)->
    # d "Routing itenary", itenary
    promises = [];
    createPromise = (stop, mode)->
      new Promise (resolve, reject)->
        googleServices.getDirections().route request, (error, result)->
          if error
            console.warn "Got routing error", error
            reject error
          else
            # d "Route itenary result", result
            encodedPoints = result.routes[0].overview_polyline
            stop.path = encodedPoints
            stop.mode = mode
            resolve encodedPoints

    for stop, i in itenary[...-1]
      nextStop = itenary[i+1];
      mode =  if stop.name.startsWith("r") or nextStop.name.startsWith("r") then "WALKING" else "DRIVING";
      request =
        travelMode: google.maps.TravelMode[mode]
        origin: googleServices.toLatLng(stop.loc)
        destination: googleServices.toLatLng(nextStop.loc)
      promises.push createPromise(stop, mode)
    return Promise.all(promises)



#@carpoolService = new CarpoolService
