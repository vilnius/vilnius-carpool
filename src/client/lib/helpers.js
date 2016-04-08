Handlebars.registerHelper('isRoute',function(route, result) {
	return Router.current().route.name == route ? result : "";
});

Handlebars.registerHelper('ofUserId',function(userId) {
	return Meteor.users.findOne(userId);
});

Handlebars.registerHelper('formatDate',function(input, pattern) {
	  var iso = /^(\d{4})(?:-?W(\d+)(?:-?(\d+)D?)?|(?:-(\d+))?-(\d+))(?:[T ](\d+):(\d+)(?::(\d+)(?:\.(\d+))?)?)?(?:Z(-?\d*))?$/;
	  if(input) {
		var time = new Date(input);
	  	time.setMinutes(time.getMinutes()-time.getTimezoneOffset());
		//d("Time adjusted time zone:"+input,time,['trip-edit']);
	  	var timeString = time.toISOString();
		//var timeString = '2011-10-05T14:48:00.000Z';
		var parts = timeString.match(iso);
		//d("Parts:", parts);
	  	return pattern.format(parts, {yyyy:1,MM:4,dd:5,hh:6,mm:7,ss:8,SSS:9});
	  }
	  return this[input];
});

Handlebars.registerHelper('stringify',function(input){
	    return JSON.stringify(input);
});

Handlebars.registerHelper('nonblank',function(text, symbol) {
	return text ? text : !symbol.hash && symbol || "-";
});

Handlebars.registerHelper('session',function(input, field) {
	if(input.hash) {
		//d("Session called only with options",input);
		if(input.hash.operator) {
			var obj = Session.get(input.hash.obj);
			return compare(input.hash.operator, obj, input.hash.value);
		}
	} else if(field.hash) {
		//v("Session object "+input);
		return Session.get(input);
	} else {
        var value = Session.get(input) ? getProperty(Session.get(input),field) : ""
        //v("Session property "+input+" "+field+" "+value);
        return value;
    }
});

Handlebars.registerHelper("compare", function(operator, options) {
	//d("Comparing:", [operator, options]);
	if (operator) {
		return options.fn(this);
	} else {
		return options.inverse(this);
	}
});

Handlebars.registerHelper("equal", function(options) {
	//d("qeual", options);
	return options.hash.obj == options.hash.value;
});


compare = function(operator, lvalue, rvalue) {
	//d("Comparing:",[operator, lvalue, rvalue]);
    var operators = {
        '==':       function(l,r) { return l == r; },
        '===':      function(l,r) { return l === r; },
        '!=':       function(l,r) { return l != r; },
        '<':        function(l,r) { return l < r; },
        '>':        function(l,r) { return l > r; },
        '<=':       function(l,r) { return l <= r; },
        '>=':       function(l,r) { return l >= r; },
        'typeof':   function(l,r) { return typeof l == r; }
    }
    if (!operators[operator])
       	throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);
    return operators[operator](lvalue,rvalue);
};

function getProperty(obj, prop) {
    var parts = prop.split('.'),
        last = parts.pop(),
        l = parts.length,
        i = 1,
        current = parts[0];
    while(current && (obj = obj[current]) && i < l) {
        current = parts[i];
        i++;
    }
    //d("Obj:"+last, obj);
    return obj && obj[last];
}
