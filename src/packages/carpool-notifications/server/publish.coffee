Meteor.publish 'Notifications', ->
  NotificationHistory.find();
