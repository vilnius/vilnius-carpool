Meteor.publish 'Chat', ->
  #ChatHistory.find({userId: this.userId});
  ChatHistory.find({});
