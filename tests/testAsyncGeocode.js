suite('Async', function() {

    test('Save trip without toLoc and call refetch when reading', function(done, server, cA, cB) {
    	server.eval(createTwoUsers)
    	.once('created', function() {
    		cB.eval(loginBcAndWaitToRefetch)
    		.once('waitingRefetch', function(trip, found) {
    		  cA.eval(loginAcCreateTripAndWaitRefetch)
    		  .once('tripRefetched', function(trip) {
    			 done(); 
    		  });
			});			
    	});
    });
        
	function createTwoUsers() {
		Accounts.createUser({
			email : 'a@a.com',
			password : '123456'
		});
		Accounts.createUser({
			email : 'b@b.com',
			password : '123456'
		});
		d("Accounts created",'',['async-capsule']);
		emit('created');
	}	
    
	function loginBcAndWaitToRefetch() {
		Meteor.loginWithPassword('b@b.com', '123456', function() {
			d("Wait for new trip to appear");
			Trips.find().observeChanges({
				added: function(id, trip) {
					d("Added trip:"+id, trip, ['test-trips','async-capsule']);
					trip._id = id;
					new Trip(trip).refetch(Trips);
				}
			});
			emit('waitingRefetch');
		});
	}
	
	function loginAcCreateTripAndWaitRefetch() {
		Meteor.loginWithPassword('b@b.com', '123456', function() {
			d("Wait for trip update");
			Trips.find().observe({
				changed : function(newTrip,oldTrip) {
					d("Changed trip:", newTrip, ['test-trips', 'async-capsule']);
					emit('tripRefetched', newTrip);
				}
			});
			Meteor.call('saveTrip', {
					"toStreet" : "Muitines",
					"toHouse" : "35",
					"toCity" : "Vilnius",
					"fromStreet" : "Filaretų g.",
					"fromHouse" : "41",
					"fromCity" : "Vilnius",
					"role" : "driver",
					"tripTime" : new Date(),
			});
		});
		
	}
});    
    
