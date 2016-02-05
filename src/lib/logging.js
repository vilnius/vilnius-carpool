/**
 * Aspect idea is to mark logging with diferent tags ['DEBUG','map-problem','TKM-1','0.0.7'...] and highligt only
 * active aspect messages
* Origin: Copied from TaskTracker
* Date 2013.04.08
* Version 0.0.5
*/


function async(data, callback) {
	callback().call(null,null);
};
fn = Meteor._wrapAsync(async);


aspect = [
  'INFO',
	'DEBUG',
  //'wru',
  //'favorite-trips',
  //'http-log',
  //'long-trips',
  //'ifttt-router',
  //'trips-drawing',
	//'map-bridge',
	//'viewport-map',
	//'group-security';
	//"xpoll";
	//"data-publish",
	//"notifications-profile";
	//"trip-edit";
	//"trip-view";
	//"ie8-router"
	//"edit-trip"
	//'test-trips';
	//'group-editing'
	//'fixes';
	//'time-pick';
	//'default-group';
  //'0.1.4',
	//'queues',

	'get-path',
	//'map-component',
	//'geoloc',
	//"async-capsule",
	//'trip-capsule',
	//'add-trip'
	'edit-trip',
	'active-trips',
	'trips-drawing',
];

/*
	TODO

jsonLogger = function() {

}

objectLogger = function() {

}

aspect = {
	'INFO': jsonLogger
}

*/

v = function (text) {
	if(console)
		console.log(text);
};

d = function (text,obj) {
	if(!console) return;
	// Print on console
	if(obj) {
		console.log(text, JSON.stringify(obj));
	} else {
		v(text);
	}
}

e = function (text, obj) {
	console.dir(obj);
	d(text+" Error:"+new Error().stack);
}

wru = function() {
	console.log("Wru:" + new Error().stack);
}

da = function (aspects,text,obj) {
	if(!console) return;

	if(!aspects) {
		// if no aspects provided skip
		return;
	} else {
		// if aspects present, filter by active
		currentAspect = _.intersection(aspects, aspect)
		if(0 == currentAspect) {
			return;
		}
	}
	// Print on console
	if(obj) {
		console.log(JSON.stringify(currentAspect)+":"+text, JSON.stringify(obj));
	} else {
		console.log(JSON.stringify(currentAspect)+":"+text);
	}
}

di = function (aspects,text,obj) {
	if(!console) return;

	if(!aspects) {
		// if no aspects provided skip
		return;
	} else {
		// if aspects present, filter by active
		//if(-1 == _.indexOf(aspects, aspect)) {
		if(0 == _.intersection(aspects, aspect)) {
			return;
		}
	}

	// Print on console
	if(obj) {
		console.log({m:text, o:obj})
	} else {
		v(text);
	}
}
