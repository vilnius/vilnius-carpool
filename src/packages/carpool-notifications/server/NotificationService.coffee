Meteor.startup ()->
  if(Meteor.settings.push)
    Push.Configure Meteor.settings.push
  else
    console.warn("Setup APN as described in https://github.com/vilnius/vilnius-carpool/wiki/Configuration-setup");

class @NotificationService
  notifyRequestRide: (trip)->
    user = Meteor.user();
    requestor = getUserEmail(user);
    tripOwner = Meteor.users.findOne(trip.owner);
    emailText = 'User ' + requestor + ' wants to join the trip\n' + trip.fromStreet + ' ' + trip.fromHouse + '-' + trip.toStreet + ' ' + trip.toHouse + '\n'
    Email.send
      from: requestor || "spastai@gmail.com",
      to: getUserEmail(tripOwner),
      subject: "Asking to join the trip",
      text: emailText

  notify: (reason, text, userId, context)->
    da ["notifications"], "Notify #{userId}: #{text}"
    last = NotificationHistory.findOne({}, sort: addedAt: -1)
    badge = 1
    if last != null
      badge = last?.badge + 1
    NotificationHistory.insert {
      badge: badge
      addedAt: new Date
      context: context
      userId: userId
      reason: reason
    }, (error, result) ->
      Push.send
        from: 'push'
        title: 'Carpool'
        text: text
        badge: badge
        payload:
          historyId: result
          context: context
          reason: reason
        query: userId: userId

  notifyAboutTrip: (reason, userId, trip, context)->
    text = "Trip #{reason}: #{trip.fromAddress}-#{trip.toAddress}"
    da ["notifications"], "Notify #{userId}: #{text}"
    last = NotificationHistory.findOne({}, sort: addedAt: -1)
    badge = 1
    if last != null
      badge = last?.badge + 1
    NotificationHistory.insert {
      badge: badge
      addedAt: new Date
      trip: trip._id
      context: context
      userId: userId
      reason: reason
    }, (error, result) ->
      Push.send
        from: 'push'
        title: 'Carpool'
        text: text
        badge: badge
        payload:
          title: "Trip #{reason}"
          trip: trip._id
          historyId: result
          context: context
          reason: reason
        query: userId: userId

  removeTripNotifications: (tripId)->
    NotificationHistory.remove({trip: tripId})
