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
			"appId" : "",
			"secret" : "",
			"_id" : ""
    	});
    }
});
