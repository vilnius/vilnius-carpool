helper = new (require '../actions').Helper()

describe 'Save trip in a group', ->
  it 'it should stay on a group page', (done, server, cA, cB) ->
    cA.eval helper.createABUsers
    cA.once 'usersCreated', ->
      cA.eval helper.userACreatesGroup
    cA.once 'groupCreated', (data)->
      cB.eval helper.userBJoinsGroup
      cB.eval ((group)->
        Meteor.loginWithPassword 'b@b.com', '123456', (err)->
          Router.go "/run"
          trip = {
            group: group && group.id
            #"fromAddress" : "Filaretų g. 35,Vilnius", 
            #"fromCity" : "Vilnius", 
            #"fromHouse" : "35", 
            "fromLoc" : [  25.311712899999975,  54.684898 ], 
            #"fromStreet" : "Filaretų g.", 
            #"path" : "utwlI}tnyCRjFHjDHpAdCuHZ{@vB{DbAsAn@m@vAoAxAs@lAGrEz@hB`Av@`AlAxAt@~@xAlBbCvCbDbFnAjCR^z@~Bj@lB`@dBvB`L~ClVxCrNh@dBpA~Gb@rCNbCX|IPlCR`BzAvJdA`KVbCJ`Bv@tEdAvEIPCPAr@Dd@", 
            "requests" : [ ], 
            "role" : "driver", 
            #"toAddress" : "Seinų g. 1,Vilnius", 
            #"toCity" : "Vilnius", 
            #"toHouse" : "1", 
            "toLoc" : [  25.284004099999947,  54.6713496 ], 
            #"toStreet" : "Seinų g.", 
            "tripTime" : new Date(),
            "time" : new Date()
          }
          TripBusinessLogic.saveTrip trip, (error, value)->
            Deps.autorun ->
              if Subs.ready(['activeTrips', 'ownTrips'])
                d "Path:", Router.current().path 
                emit 'done'
      ), data
    cB.once 'done', ->
      done();
      
  