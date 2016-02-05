helper = new (require '../../actions').Helper()

describe 'Save trip, asign global trip, modify it and save again', ->
  it 'it should calculate path Tmh-10:UC1', (done, server, cA, cB) ->
    cA.eval helper.createABUsers
    cA.once 'usersCreated', ->
      cA.eval ->
        aspect.push('long-trips');
        aspect.push('viewport-map');
        #aspect.push('map-bridge');
        #aspect.push('trip-saving');
        
        Meteor.loginWithPassword 'a@a.com', '123456', (err)->
          d "Empty trip:"+trip
          mapController.createLatLng [25.311712899999975,54.684898], (err, result)->
            trip.setFromLatLng(result);
            mapController.createLatLng [25.284004099999947,  54.6713496], (err, result)->
              trip.setToLatLng(result);
              d "Filled trip:"+trip
              handle = Trips.find({}).observe({
                changed: (newItem, oldItem)->
                  d("Changed saved trip:", newItem);
                  #trip = newItem
                  mapController.setTrip(new Trip(newItem));
                  handle.stop();
                  emit("tripSaved", trip)
              });
              waitForDOM '.save', () ->
                d 'Clicking to save trip'
                $('.save[value="driver"]').click()
    cA.once 'tripSaved', ->
      cA.eval ->
        Meteor.loginWithPassword 'a@a.com', '123456', (err)->
              d("Global trip:"+trip);
              Trips.find({}).observe({
                changed: (newItem, oldItem)->
                  d("Changed updated trip:", newItem);
                  trip = newItem
                  
                  d "Only 3rd change shows actual change - the test is no completed"
                  emit("done", trip)
              });
              mapController.getTrip().setToLatLng new google.maps.LatLng(54.671111,25.2841111);
              d 'Set trip toLatLng:'+trip
              waitForDOM '.save', () ->
                d 'Clicking to update trip:'+trip
                $('.save[value="driver"]').click()
      
    cA.once 'done', ->
      done()            
      
