class @TripsMatcher

  locRadiusFilter = 1000 * 180 / (3.14 * 6371 * 1000)

  start: ->
    Trips.before.insert @notifyMatchingTrips.bind(@)
    da [ 'trips-matcher' ], 'started - TripsMatcher'

  findMatchingTrips: (trip) ->
    query =
      _id: $ne: trip.owner
      role: if trip.role == 'driver' then 'rider' else 'driver'
    if trip.fromLoc
      startsQuery = _.extend({ fromLoc:
        $near: trip.fromLoc
        $maxDistance: locRadiusFilter }, query)
      tripsByStart = Trips.find(startsQuery, sort: time: -1).fetch()
      stopsQuery = _.extend({ 'stops.loc':
        $near: trip.fromLoc
        $maxDistance: locRadiusFilter }, query)
      tripsByStops = Trips.find(stopsQuery, sort: time: -1).fetch()
      da ['trips-matcher'], 'Merge trips near stops into starting point ' + tripsByStops.length, trip
      mergedTrips = _(_(tripsByStart).indexBy('_id')).extend(_(tripsByStops).indexBy('_id'))
      trips = _(mergedTrips).values()
    else
      trips = Trips.find(query, sort: time: -1).fetch()
    da ['trips-matcher'], 'Trips start near the stop count:', trips.length
    if trip.toLoc != null
      ids = _(trips).pluck('_id')
      refinedQuery =
        _id: $in: ids
        toLoc:
          $near: trip.toLoc
          $maxDistance: locRadiusFilter
      da ['trips-matcher'], 'Notify trips filtered by:', query
      trips = Trips.find(refinedQuery, sort: time: -1).fetch()
    return trips

  notifyMatchingTrips: (userId, doc)->
    doc.status = 'scheduled'
    da [ 'trips-matcher' ], 'Find inserted doc matching trips:', doc
    trips = @findMatchingTrips(doc)
    results = []
    for trip in trips
      userId = trip.owner
      results.push notificationService.notifyAboutTrip('matched', userId, doc, trip)
    results

  stop: ->
    da [ 'trips-matcher' ], 'stopped - TripsMatcher'
