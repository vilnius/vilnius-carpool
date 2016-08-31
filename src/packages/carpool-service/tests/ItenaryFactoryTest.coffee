d = console.log.bind console

if Meteor.isServer
  Tinytest.add "Itenary - Single ride", (test) ->
    #Trips.remove({});
    ride = JSON.parse(Assets.getText("tests/CarpoolServiceClientTest-ride.json"))
    ride._id = "xxxxxxxxxxxxxxxxxx"
    # d "Ride:", ride
    itenary = ItenaryFactory.createRiderItenary(ride);
    test.length itenary, 2, "Should contain A,B points"

  Tinytest.add "Itenary - Rider without ride", (test) ->
    drive = JSON.parse(Assets.getText("tests/CarpoolServiceClientTest-drive.json"))
    drive._id = "yyyyyyyyyyyyyyyyyy"
    itenary = ItenaryFactory.createRiderItenary(undefined, drive);
    test.length itenary, 2, "Should contain dirver A, B points"

  Tinytest.add "Itenary - Ride with drive", (test) ->
    ride = JSON.parse(Assets.getText("tests/CarpoolServiceClientTest-ride.json"))
    ride._id = "xxxxxxxxxxxxxxxxxx"
    drive = JSON.parse(Assets.getText("tests/CarpoolServiceClientTest-drive.json"))
    drive._id = "yyyyyyyyyyyyyyyyyy"
    itenary = ItenaryFactory.createRiderItenary(ride, drive);
    test.length itenary, 4, "Should contain A, pick-up, drop-off, B points"
    d "Itenary:", itenary
