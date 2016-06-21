Meteor.startup ()->
  #console.log "0.1.8_2 Notifications started"
  if Meteor.isCordova
    #d "Setting alter:", navigator
    window.alert = navigator.notification?.alert

  Push.Configure Meteor.settings.public.push
  #d "Push configuration", Meteor.settings.public.push

  Push.addListener 'startup', (notification) ->
    da ["trip-notifications"], "Startup on notification:", notification
    flowControllerHelper.showNotifiedView(notification.payload);

  Push.addListener 'alert', (notification)->
    da ["trip-notifications"], "Notification while open:", notification

  Push.addListener 'message', (notification) ->
    # Called on every message
    alertDismissed = ->
      NotificationHistory.update { _id: notification.payload.historyId }, $set: 'recievedAt': new Date
    da ["trip-notifications"], "Notification received:", notification


class @NotificationClient
  dismissAlert: (id)->
    NotificationHistory.update { _id: id }, $set: 'recievedAt': new Date
