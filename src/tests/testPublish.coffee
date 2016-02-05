# laika --ui bdd --compilers coffee:coffee-script -V -t 20000 tests/testPublish.coffee

assert = require 'assert'

Helper = require './actions'
helper = new Helper.Helper()

describe 'Publish 1 trip as public and 1 in group', ->

  prepare = (done, server, cA, cB) ->
    cA.eval helper.createABUsers
    cA.once 'usersCreated', ->
      cA.eval helper.userACreatesGroup
    cA.once 'groupCreated', (data)->
      cB.eval helper.userBLogsIn
      cB.eval helper.createTripOneAsB, data
      cB.eval helper.userBJoinsGroup
    cB.once 'tripOneCreated', -> 
      cB.eval helper.createTripTwoAsB  

  it '/ should see one trip UC1.1', (done, server, cA, cB) ->
    prepare(done,server, cA, cB);
    cB.once 'tripTwoCreated', -> 
      cB.eval ->
        d "Routing to root as:"+Meteor.userId()
        Router.go "/"        
        Deps.autorun ->
          d "Is router ready:"+Router.current().ready() 
          if Router.current().ready()
            d "Is subscriptions ready:"+Subs.ownTrips.ready()
            #d "WARN Without calling line below autorun doesn't work:"+tripClient.getOwnTrips().length
            tripClient.getOwnTrips().length
            if Subs.ownTrips.ready() 
              d "Own public trips when router ready:"+tripClient.getOwnTrips().length
              emit 'gotOwnPublicTrips', tripClient.getOwnTrips().length                             
    cB.once 'gotOwnPublicTrips', (result) ->
      assert.equal(result, 1);
      done();
            
  it '/run should see two trips UC1.2', (done, server, cA, cB) ->  
    prepare(done,server, cA, cB);
    cB.once 'tripTwoCreated', -> 
      cB.eval ->
        d "Routing to group login is valid still"
        Router.go "/run"        
        Deps.autorun ->
          if Router.current().ready()
            tripClient.getOwnTrips().length
            if Subs.ownTrips.ready() 
              d "Own public trips when router ready:"+tripClient.getOwnTrips().length
              emit 'gotOwnGroupTrips', tripClient.getOwnTrips().length 
      cB.once 'gotOwnGroupTrips', (result) ->
        assert.equal(result, 2, "Group should see public and group trips");
        done();

  it '/?editTrip with location near should show one own trip UC2.1', (done, server, cA, cB) ->  
    prepare(done,server, cA, cB);
    cB.once 'tripTwoCreated', -> 
      cB.eval ->
        d "Routing filter toLoc"       
        Router.go "/?step=editTrip&locToLng=25.284004099999947&locToLat=54.6713496"        
        Deps.autorun ->
          if Router.current().ready()
            tripClient.getOwnTrips().length
            if Subs.ownTrips.ready() 
              d "Own public trips when router ready:"+tripClient.getOwnTrips().length
              emit 'gotOwnTrips', tripClient.getOwnTrips().length 
      cB.once 'gotOwnTrips', (result) ->
        assert.equal(result, 1, "Group should see public and group trips");
        done();

  it '/?editTrip with location far should show zero active trips UC2.2', (done, server, cA, cB) ->  
    prepare(done,server, cA, cB);
    cB.once 'tripTwoCreated', -> 
      cB.eval ->
        d "Routing filter toLoc by point not near"       
        Router.go "/?step=editTrip&locToLng=25.284004099999947&locToLat=50.00"        
        Deps.autorun ->
          if Subs.ready(['activeTrips', 'ownTrips']) 
            d "Active public trips when router ready:"+tripClient.getActiveTrips().length
            emit 'gotActiveTrips', {
              activeTrips: tripClient.getActiveTrips().length
              ownTrips: tripClient.getOwnTrips().length
            }
      cB.once 'gotActiveTrips', (result) ->
        assert.equal(result.activeTrips, 0, "Filter by not near point should return 0 active trips");
        assert.equal(result.ownTrips, 1, "Filter by not near point should return 1 own trips");
        done();
        
  it 'group with location far should show zero active trips UC2.3', (done, server, cA, cB) ->  
    prepare(done,server, cA, cB);
    cB.once 'tripTwoCreated', -> 
      cB.eval ->
        d "Routing filter toLoc by point not near"       
        Router.go "/run?step=editTrip&locToLng=25.284004099999947&locToLat=54.6713496"        
        Deps.autorun ->
          if Subs.ready(['activeTrips', 'ownTrips']) 
            d "Active public trips when router ready:"+tripClient.getActiveTrips().length
            emit 'gotActiveTrips', {
              activeTrips: tripClient.getActiveTrips().length
              ownTrips: tripClient.getOwnTrips().length
            }
      cB.once 'gotActiveTrips', (result) ->
        assert.equal(result.activeTrips, 0, "Filter by not near point should return 0 active trips");
        assert.equal(result.ownTrips, 2, "Filter by not near point should return 1 own trips");
        done();
        