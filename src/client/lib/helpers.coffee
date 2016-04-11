Handlebars.registerHelper 'userPictureUrl', (userId) ->
  user = Meteor.users.findOne(userId)
  result = '/img/Man_Silhouette.png'
  #d("User picture:"+userId, user);
  if user
    if user.services.facebook then 'http://graph.facebook.com/' + user.services.facebook.id + '/picture' else result
  else
    result

Handlebars.registerHelper 'displayName', (user) ->
<<<<<<< HEAD
=======
  #d("Showing display name:", user);
>>>>>>> 0.1.9/refactor/meteor-1.3
  user?.profile?.name or getUserEmail(user)

Handlebars.registerHelper 'displayNameById', (userId) ->
  #d("Showing display name:", user);
  user = Meteor.users.findOne(userId)
  user?.profile?.name or getUserEmail(user)
