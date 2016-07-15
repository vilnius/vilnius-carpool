class @TripsMatcher

  locRadiusFilter = 1000 * 180 / (3.14 * 6371 * 1000)
  timeInterval = 15

  start: ->
    Trips.before.insert @notifyMatchingTrips.bind(@)
    da [ 'trips-matcher' ], 'started - TripsMatcher'


  pointsNearFields: (query, fields, points, distance)->
    indexes = {};
    for point in points
      #da ['trips-matcher'], "Trip point", point
      for field in fields
        geoQuery = {}
        geoQuery[field] =
          $near: point
          $maxDistance: distance
        _(geoQuery).extend(query);
        #da ['trips-matcher'], "Geo query", geoQuery
        filtered = Trips.find(geoQuery, sort: time: -1).fetch()
        _(indexes).extend(_(filtered).indexBy('_id'))
        #da ['trips-matcher'], "Indexes", indexes
    return indexes

  ###
    Select existing trips matching new trip by locations and time
  ###
  findMatchingTrips: (trip) ->
    bTime = moment(trip.bTime)
    query =
      _id: $ne: trip.owner
      role: if trip.role == 'driver' then 'rider' else 'driver'
      $or: [
        {repeat: bTime.isoWeekday()-1},
        bTime:
          $gte: bTime.subtract(timeInterval, "m").toDate()
          $lt: bTime.clone().add(2*timeInterval, "m").toDate()
        ]
    #d "Trip notification matching query", query['$or']
    if trip.fromLoc?
      points = _(trip.stops).pluck("loc");
      points.push(trip.fromLoc);
      #da ['trips-matcher'], "Drive points", points
      mergedTrips = @pointsNearFields query, ["fromLoc", "stops.loc"], points, locRadiusFilter
      trips = _(mergedTrips).values()
      da ['trips-matcher'], "Merge trips count #{trips.length}"
    else
      trips = Trips.find(query, sort: time: -1).fetch()
    da ['trips-matcher'], "Trips start near the stop count: #{trips.length}"
    if trip.toLoc?
      ids = _(trips).pluck('_id')
      refinedQuery =
        _id: $in: ids
        toLoc:
          $near: trip.toLoc
          $maxDistance: locRadiusFilter
      da ['trips-matcher'], 'Notify trips filtered by:', query
      trips = Trips.find(refinedQuery, sort: time: -1).fetch()
    return trips

  notifyMatchingTrips: (userId, newTrip)->
    newTrip.status = 'scheduled'
    da [ 'trips-matcher' ], 'Find inserted newTrip matching trips:', newTrip
    trips = @findMatchingTrips(newTrip)
    results = []
    for trip in trips
      userId = trip.owner
      results.push notificationService.notifyAboutTrip('matched', userId, newTrip, trip)
    results

  stop: ->
    da [ 'trips-matcher' ], 'stopped - TripsMatcher'
