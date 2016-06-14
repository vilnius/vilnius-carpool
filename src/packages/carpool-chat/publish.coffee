Meteor.publish 'Chat', (cdUserId)->
  ChatHistory.find({userId: this.userId, to: cdUserId});
  #ChatHistory.find({});
