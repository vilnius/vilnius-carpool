export const getUserName = function(user) {
	//console.log("User", user);
	if(!user) return "..."
	if(user.profile && user.profile.name) {
		return user.profile.name;
	} else if(user.emails) {
		return user.emails[0].address;
	} else {
		return user.username;
	}
};

export const getUserPicture = function(user) {
  var result;
  result = '/img/Man_Silhouette.png';
  if (user) {
    if (user.services.google) {
      return user.services.google.picture;
    } else if (user.services.facebook) {
      return 'http://graph.facebook.com/' + user.services.facebook.id + '/picture';
    } else if (user.profile.avatar != null) {
      return user.profile.avatar;
    } else {
      return result;
    }
  } else {
    return result;
  }
};
