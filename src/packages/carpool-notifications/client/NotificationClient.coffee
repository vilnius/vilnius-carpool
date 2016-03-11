Meteor.startup ()->
  if Meteor.isCordova
    d "Setting alter:", navigator
    window.alert = navigator.notification?.alert

  Push.addListener 'message', (notification) ->
    # Called on every message
    alertDismissed = ->
      NotificationHistory.update { _id: notification.payload.historyId }, $set: 'recievedAt': new Date
      return

    console.log JSON.stringify(notification)
    alert notification.message, alertDismissed, notification.payload.title, 'Ok'
