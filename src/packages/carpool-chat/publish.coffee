Meteor.publish 'Chat', (cdUserId)->
  ChatHistory.find({from: this.userId, to: cdUserId});
  #ChatHistory.find({});
