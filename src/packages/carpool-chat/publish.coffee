Meteor.publish 'Chat', (cdUserId)->
  ChatHistory.find($or:[{from: this.userId, to: cdUserId},{from: cdUserId, to: this.userId}]);
  #ChatHistory.find({});
