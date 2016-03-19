Meteor.startup ()->
  console.log "0.1.8_1 Notifications started"
  if Meteor.isCordova
    d "Setting alter:", navigator
    window.alert = navigator.notification?.alert

  Push.addListener 'startup', (notification) ->
    da ["trip-notifications"] "Startup on notification:", notification

  Push.addListener 'message', (notification) ->
    # Called on every message
    alertDismissed = ->
      NotificationHistory.update { _id: notification.payload.historyId }, $set: 'recievedAt': new Date
    da ["trip-notifications"] "Notification received:", notification
