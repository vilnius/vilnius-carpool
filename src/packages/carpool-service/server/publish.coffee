locRadiusFilter = 1000 * 180 / (3.14 * 6371 * 1000)
timeInterval = 15


Meteor.publish 'favorites', ->
  Selections.find()

Meteor.publish 'stops', ->
  Stops.find()

Meteor.publish 'oneTrip', (filter) ->
  da ['one-trip-publish'], "Publishing one trip", filter
  Trips.find filter

###
  This version turns recurrent trips into normal with next upcoming time.
  TODO Warning: if anything except B location change - this will not be noticed for client
  TODO Implement test case: trip is created and shown by query, then change it
  TODO fix this with https://www.npmjs.com/package/geolib
###
Meteor.publish 'activeTrips', (filter = {}) ->
  query = _(filter).omit("fromLoc", "toLoc", "bTime");
  if filter.bTime?
    bTime = moment(filter.bTime)
    query['$or'] = [
      {repeat: bTime.isoWeekday()-1},
      bTime:
        $gte: bTime.subtract(timeInterval, "m").toDate()
        $lt: bTime.clone().add(2*timeInterval, "m").toDate()
    ]
    da ['trip-publish' ], "activeTrips filter query", filter['$or']
  if filter.fromLoc?
    query['stops.loc'] =
      $near: filter.fromLoc
      $maxDistance: locRadiusFilter
  da [ 'trip-publish' ], 'Publish activeTrips by stops.loc:', query
  cursor = Trips.find(query, fields: requests: 0)

  if filter.toLoc?
    ids = _(cursor.fetch()).pluck('_id')
    refinedQuery =
      _id: $in: ids
      toLoc:
        $near: filter.toLoc
        $maxDistance: locRadiusFilter
    da ['trip-publish'], 'Publish refined activeTrips:', refinedQuery
    cursor = Trips.find(refinedQuery)

  handle = cursor.observe
    added: (document)=>
      nextDate(document, moment(filter.bTime))
      da ['trip-publish'], "Added to subscribtion trip #{document._id}", document.bTime
      @added "trips", document._id, document
    changed: (newDocument, oldDocument)=>
      nextDate(document, moment(filter.bTime))
      @changed "trips", oldDocument._id, newDocument
    removed: (oldDocument)=>
      @removed "trips", oldDocument._id

  @onStop ()->
    handle.stop();
    #d "Stoped activeTrips handle"

  @ready();

Meteor.publish 'userContacts', ->
  da [ 'data-publish' ], 'Publish user contacts'
  cursor = Meteor.users.find {}, fields:
    'profile': 1
    'services.google.picture': 1
    'services.facebook.id': 1

Meteor.publish 'ownTrips', ->
  if !@userId
    da [ 'trip-publish' ], 'Do not block subscribtions for not logged in users'
    @ready()
    return
  tripQuery = owner: @userId
  da [ 'trip-publish' ], 'Publishing ownTrips for: ' + @userId, tripQuery
  result = Trips.find(tripQuery)
  da [ 'trip-publish' ], 'Found ownTrips :' + result.fetch().length
  @ready()
  result

Meteor.publish 'notifiedTrips', ->
  showHistory = false
  query =
    recievedAt: $exists: showHistory
    userId: @userId
  notifications = NotificationHistory.find(query).fetch()
  tripQuery = _id: $in: _(notifications).pluck('trip')
  da [ 'trip-publish' ], 'Notified trips query ' + @userId, tripQuery
  Trips.find tripQuery
