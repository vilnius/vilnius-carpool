helper = new (require '../actions').Helper()

describe 'Add trip by posting to url', ->
  it 'refetched should contain toAdress and fromAddress ', (done, server,cA, cB) ->
    cB.eval helper.createABUsers
    cB.once 'usersCreated', ->
      cA.eval ->
        aspect.push('map-bridge');
        aspect.push('async-capsule');        
        
        Meteor.loginWithPassword 'a@a.com', '123456', (err)->
          Trips.find({}).observe({
            added: (newItem)->
              #d("Added trip, do refetch:", newItem);
              #new Trip(newItem).refetch();
              #new Trip(newItem);
          });      
      cB.eval ->
        aspect.push('map-bridge');
        aspect.push('async-capsule');        
        Meteor.loginWithPassword 'b@b.com', '123456', (err)->
          d "User B logged in:", Meteor.userId();
          
          #working one
          #url = "/addTrip?tripLocs=e}nyCctwlIdtDdtA&id="+Meteor.userId()
          url = "/addTrip?tripLocs=ctwlIe%7DnyCgrAhgH"+Meteor.userId() 
                    
          HTTP.call "GET", url, (error, result) -> 
            if (!error)
              emit "tripPosted"
            else 
              #d 'Error', error          
    cB.once 'done', ->
      done()