Package.describe({
    summary: "Winston logger integration",
});


Package.on_use(function (api) {
	//api.use(["underscore"], "server");

    api.add_files('logger.js', ['server']);
    
    if (api.export) api.export(['logger'], ['server']);
});

Npm.depends({
	"winston": "0.7.2",
	"winston-papertrail": "0.1.4"
});
