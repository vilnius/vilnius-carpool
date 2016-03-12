Handlebars.registerHelper 'userPictureUrl', (userId) ->
  user = Meteor.users.findOne(userId)
  result = '/img/Man_Silhouette.png'
  #d("User picture:"+userId, user);
  if user
    if user.services.facebook then 'http://graph.facebook.com/' + user.services.facebook.id + '/picture' else result
  else
    result
