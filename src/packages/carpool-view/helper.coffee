# TODO - something wrong with exports 
getUserPicture = (user) ->
  result = '/img/Man_Silhouette.png'
  #d("User picture:", user);
  if user
    if user.services.google
      user.services.google.picture
    else if user.services.facebook
      'http://graph.facebook.com/' + user.services.facebook.id + '/picture'
    else if user.profile.avatar?
      user.profile.avatar
    else
      result
  else
    result

exports.getUserPicture = getUserPicture
