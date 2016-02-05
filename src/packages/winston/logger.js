winston = Npm.require('winston');
logger = new winston.Logger ({
	transports: [
	  new (winston.transports.Console)({
		  timestamp: true
	  })
	]
});
/*
//logs.papertrailapp.com:24644
var Papertrail = Npm.require('winston-papertrail').Papertrail;
logger.add(Papertrail, {
  host: "logs.papertrailapp.com",
  port: 24644, //this will be change from the papertrail account to account
  logFormat: function(level, message) {
      return '[' + level + '] ' + message;
  },
  inlineMeta: true
});
*/