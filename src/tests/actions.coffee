root = exports ? this

class @Helper
  name: "Helper actions"

  createABUsers: -> 
    Accounts.createUser({
      email: 'a@a.com',
      password: '123456'
    });
    Accounts.createUser({
      email : 'b@b.com',
      password : '123456'
    }, () ->
      emit('usersCreated');
    );

  userACreatesGroup: ->
    Meteor.loginWithPassword 'a@a.com', '123456', (err)->
      d "userACreatesGroup:", err
      group = {
         "description" : "", 
         "groupId" : "LIMA0", 
         "invitees" : [], 
         "members" : [], 
         "niceLink" : "run",
         "title" : "Run" }
      TripBusinessLogic.saveGroup undefined, group, (error, id) ->
        emit('groupCreated',{id: id});  

  userBLogsIn: ->
    Meteor.loginWithPassword 'b@b.com', '123456', (err)->
      d "User B logged in (form seom reason it takes time to create user):"+Meteor.userId(), err

  userBJoinsGroup: ->
    Meteor.loginWithPassword 'b@b.com', '123456', (err)->
      d "Enroll to group through secretLink:"+Meteor.userId(), err
      Router.go "/e/LIMA0"  

  createTripOneAsB: (group)-> 
    Meteor.loginWithPassword 'b@b.com', '123456', (err)->
      d "createTripOneAsB:", err
      Meteor.call('saveTrip', {
        group: group && group.id
        "fromAddress" : "Filaretų g. 35,Vilnius", 
        "fromCity" : "Vilnius", 
        "fromHouse" : "35", 
        "fromLoc" : [  25.311712899999975,  54.684898 ], 
        "fromStreet" : "Filaretų g.", 
        "path" : "utwlI}tnyCRjFHjDHpAdCuHZ{@vB{DbAsAn@m@vAoAxAs@lAGrEz@hB`Av@`AlAxAt@~@xAlBbCvCbDbFnAjCR^z@~Bj@lB`@dBvB`L~ClVxCrNh@dBpA~Gb@rCNbCX|IPlCR`BzAvJdA`KVbCJ`Bv@tEdAvEIPCPAr@Dd@", 
        "requests" : [ ], 
        "role" : "driver", 
        "toAddress" : "Seinų g. 1,Vilnius", 
        "toCity" : "Vilnius", 
        "toHouse" : "1", 
        "toLoc" : [  25.284004099999947,  54.6713496 ], 
        "toStreet" : "Seinų g.", 
        "tripTime" : new Date(),
        "time" : new Date()
      }, (err, result) ->
        emit('tripOneCreated',{trip1: '1'})
      )

  createTripTwoAsB: (group)-> 
    Meteor.loginWithPassword 'b@b.com', '123456', ->
      Meteor.call('saveTrip', {
        group: group && group.id
        "fromAddress" : "Filaretų g. 41,Vilnius", 
        "fromCity" : "Vilnius", 
        "fromHouse" : "41", 
        "fromLoc" : [  25.31212640000001,  54.6849269 ], 
        "fromStreet" : "Filaretų g.", 
        "path" : "wswlIswnyCk@RJl@T~FHjDHpAeC~F{@zA_@n@aApAiBpBuDdDaB`Bq@j@g@ZgA^q@D[BsBEiAMy@SyEwBg@Gm@@[D}@XiB^QKOAQBOLKRIVEf@@h@oAzEsCbJqBvGq@rAMH]JS@OGQAS@]JORQb@Op@Ef@@|@MnA", 
        "requests" : [ ], 
        "role" : "driver", 
        "toAddress" : "Tuskulėnų g. 2,Vilnius", 
        "toCity" : "Vilnius", 
        "toHouse" : "2", 
        "toLoc" : [  25.298080444335938,  54.696852713593216 ], 
        "toStreet" : "Tuskulėnų g.", 
        "tripTime" : new Date(),
        "time" : new Date()
      }, (err, result) ->
        d "tripTwoCreated"
        emit('tripTwoCreated',{trip1: '1'})
      )
            