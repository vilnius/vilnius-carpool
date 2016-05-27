@notificationService = new NotificationService
tripsMatcher = new TripsMatcher

Meteor.startup ->
  tripsMatcher.start()

process.on 'exit', ->
  tripsMatcher.stop()

rad = (x) ->
  x * Math.PI / 180

getDistance = (p1, p2) ->
  R = 6378137
  dLat = rad(p2[1] - (p1[1]))
  dLong = rad(p2[0] - (p1[0]))
  a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(p1[1])) * Math.cos(rad(p2[1])) * Math.sin(dLong / 2) * Math.sin(dLong / 2)
  c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  d = R * c

Meteor.methods
  removeTrip: (id) ->
    notificationService.removeTripNotifications id
    Trips.remove
      _id: id
      owner: Meteor.userId()

  requestRide: (tripId, fromLoc) ->
    requestId = undefined
    stop = undefined
    trip = undefined
    da [ 'trip-request' ], 'Request to join trip ' + tripId + ':', fromLoc
    trip = Trips.findOne(tripId)
    if fromLoc
      stop = _(trip.stops).min (item) ->
        getDistance fromLoc, item.loc

    da [ 'trip-request' ], 'Closest stop ' + tripId + ':', stop
    requestId = getRandomString('ABCDEFGHIKLMNOPQRSTUVWXY0123456789', 5)
    Trips.update { _id: tripId }, $addToSet: requests:
      asked: true
      id: requestId
      userId: @userId
      stop: stop
    notificationService.notify 'request', trip.owner, trip, requestId

  acceptRequest: (invitationId, response) ->
    request = undefined
    trip = undefined
    trip = Trips.findOne('requests.id': invitationId)
    request = _.findWhere(trip.requests, id: invitationId)
    da [ 'trip-request' ], 'Accept request from ' + request.userId + ' to join trip ' + invitationId

    ###                                                                                                 // 49
    user = Meteor.user()                                                                                   //
    #d(response+" invitation for trip:"+tripId+" user:",user);                                             //
    tripOwner = Meteor.users.findOne(trip.owner)                                                           //
    d 'Responding to invitation to trip owner:' + response, tripOwner                                      //
    inviter = getUserEmail(tripOwner)                                                                      //
    request = _.find(trip.requests, (item) ->                                                              //
      item.id == invitationId                                                                              //
    )                                                                                                      //
    emailText = 'Proposal to join the trip ' + trip.fromStreet + ' ' + trip.fromHouse + '-' + trip.toStreet + ' ' + trip.toHouse + '\n' + 'was accepted by ' + request.userEmail
    Email.send                                                                                             //
      from: request.userEmail or 'spastai@gmail.com'                                                       //
      to: inviter                                                                                          //
      subject: 'Trip invitation accepted'                                                                  //
      text: emailText                                                                                      //
    ###

    Trips.update { 'requests.id': invitationId }, $set: 'requests.$.response': response
    notificationService.notify 'confirmation', request.userId, trip, invitationId 
