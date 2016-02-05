HttpLogger = function() {
};

HttpLogger.prototype.log = function(level, message) {
	HTTP.call("POST", "/httpLog", {
		data : {
			lvl: level,
			msg: message, 
			ct: new Date()
		}
	}, function(error, result) {
		if (!error) {
		}
	});
}
