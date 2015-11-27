helper = new (require '../actions').Helper()

describe 'Save tripCapsule', ->
  it 'it should calculate path Tmg-10:UC1', (done, server, cA, cB) ->
    cA.eval helper.createABUsers
    cA.once 'usersCreated', ->
      cA.eval ->
        aspect.push('map-bridge');
        aspect.push('trip-saving');
        
        Meteor.loginWithPassword 'a@a.com', '123456', (err)->
          d "Empty trip:"+trip
          mapController.createLatLng [25.311712899999975,54.684898], (err, result)->
            trip.setFromLatLng(result);
            mapController.createLatLng [25.284004099999947,  54.6713496], (err, result)->
              trip.setToLatLng(result);
              d "Filled trip:"+trip
              Trips.find({}).observe({
                changed: (newItem, oldItem)->
                  d("Changed:", newItem);
                  emit("done")
              });
              waitForDOM '.save', () ->
                d 'Clicking to save trip'
                $('.save[value="driver"]').click()
    cA.once 'done', ->
      done()            
      
