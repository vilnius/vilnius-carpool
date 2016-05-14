nested = function( val, names ) {
    names = names.split( '.' );
    while ( val && names.length ) { val = val[ names.shift() ]; }
    return val;
}

NonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length > 0;
});

getUserEmail = function(user) {
	if(!user) return;

	if(user.services && user.services.facebook) {
		return user.services.facebook.email;
	} else if(user.emails){
		return user.emails[0].address;
	}
}

// @Deprecated  - moved to src/imports/ui/helper.js
getUserName = function(user) {
	//d("User", user);
	if(user.profile && user.profile.name) {
		return user.profile.name;
	} else if(user.emails) {
		return user.emails[0].address;
	} else {
		return user.username;
	}
};

// Session.set('currentAddress',{locality:'Vilnius', street_number: '35', route: 'Filaretu g.'})
mapGoogleAddress = function(prefix, address) {
	//d("Mapping:", address);
	var result = {};
	result[prefix+'Street'] = address.route;
	result[prefix+'House'] = address.street_number;
	result[prefix+'City'] = address.locality;
	return result;
}
