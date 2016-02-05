Meteor.startup(function () {
    if (Meteor.users.find().count() === 0) {
    	d("Creating admin user");
        Accounts.createUser({
            username: "admin@tiktai.lt",
            password: "123",
            profile: {
            	name: "Admin"
            }
        });

        // This means meteor is run for a first time
        Trips._ensureIndex({fromLoc: "2d" });
        Trips._ensureIndex({toLoc: "2d" });
        FacebookMessages._ensureIndex({fromLoc: "2d" });
        FacebookMessages._ensureIndex({toLoc: "2d" });
    }

    if (Accounts.loginServiceConfiguration.find().count() === 0) {
    	Accounts.loginServiceConfiguration.insert({
			"service" : "facebook",
			"appId" : "590506224336801",
			"secret" : "2ed27c3a4729ba4feaf666380a2a8c35",
			//"_id" : ""
    	});
    }
});
