Meteor.publish 'Notifications', ->
  NotificationHistory.find({userId: this.userId});
