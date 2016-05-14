class CarpoolService
  stopRadiusFromOrig = 1000 * 180 / (3.14 * 6371 * 1000)
  stopDistanceFromRoute = 500 * 180 / (3.14 * 6371 * 1000)
  locRadiusFilter = 1000 * 180 / (3.14 * 6371 * 1000)

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
    @clarifyPlace fromLatLng, trip.fromAddress, (err, latlng, address) =>
      da(["trip-crud"], "Clarified A: #{trip.fromAddress}", latlng)
      trip.fromLoc = googleServices.toLocation(latlng)
      @clarifyPlace toLatLng, trip.toAddress, (err, latlng, address) =>
          trip.toLoc = googleServices.toLocation(latlng)
          @getTripPath trip, (err, route) ->
            if err then return callback(err)
            _(trip).extend route
            Meteor.call 'saveTrip', trip, (error, result) ->
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
      time: $gte: fromTime
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
    fromTime = new Date(now.getTime() - (1000 * 60 * 60 * 24 * 60))
    query =
      owner: $ne: Meteor.userId()
      time: $gte: fromTime
    trips = Trips.find(query, sort: time: -1)
    trips.fetch()

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
    query = _(filter).extend(
      $or: [ { owner: userId } ]
      time: $gte: fromTime)
    cursor = Trips.find(query)
    cursor.fetch()

  ###
  Pull one trip - applies restrictions what could be retrieved
  ###
  pullOneTrip: (query, progress) ->
    @oneTripsSub = Meteor.subscribe('oneTrip', query)
    if @oneTripsSub.ready()
      progress 100
    else
      progress 0
      return null
    Trips.findOne query

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
      stopOnRoute = [ {
        _id: trip._id + '-a'
        loc: trip.fromLoc
        title: trip.fromAddress
      } ]
      for stop in stops
        stopLatLng = googleServices.toLatLng(stop.loc)
        if google.maps.geometry.poly.isLocationOnEdge(stopLatLng, polyline, stopDistanceFromRoute)
          stopOnRoute.push stop
      @routeTrip trip, (err, stopsRoute) ->
        cb null,
          path: stopsRoute.overview_polyline
          stops: stopOnRoute

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
    else
      return cb?('No locations found for ' + trip.fromAddress + '-' + trip.toAddress)

    googleServices.getDirections().route request, (error, result) ->
      encodedPoints = undefined
      if error
        return cb?(error)
      encodedPoints = result.routes[0].overview_polyline
      cb & cb(null, result.routes[0])

  getStops: ->
    Stops.find().fetch()

@carpoolService = new CarpoolService
