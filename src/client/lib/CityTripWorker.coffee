class @CityTripWorker
  getActiveTrips: (collection, refetch) ->
    self = @
    da(['active-trips'], "Getting city active trips for "+Meteor.userId());
    #console.log(new Error().stack);
    now = new Date();
    fromTime = new Date(now.getTime()-1000*60*60*24*60)

    while self.drawnActiveTrips.length > 0
      drawn = self.drawnActiveTrips.pop();
      drawn.line.setMap(null);
      for p in drawn.points
        #drawn.points[p].setMap(null);
        p.setMap(null);

    selectedTrip = currentTrip?._id;
    di ['active-trips'], "Selected trip:"+selectedTrip, currentTrip
    filter =
      owner:{$ne: Meteor.userId()},
      time: {$gte: fromTime}
    da(['data-publish','active-trips'],"Total count:"+collection.find(filter).count(), filter);
    trips = collection.find(filter, {sort:{time: -1}}).map (item)=>
      da(['async-capsule', 'active-trips'], "Creating capsule for active trips:"+Meteor.userId()+"@", item);
      tripCapsule = new Trip(item);
      if refetch
        #da(['DEBUG'], "Refetch:"+refetch+" for "+Meteor.userId()+"@", item);
        tripCapsule.refetch collection, ()->
          da ['active-trips'], "Draw trip "+tripCapsule._id, selectedTrip
          if(selectedTrip == tripCapsule._id)
            options =
              strokeColor: 'OrangeRed',
              strokeOpacity: 0.8
          else
            options =
              strokeColor: 'Grey',

          mapController.drawActiveTrip tripCapsule, options,  (error, drawnTrip) =>
            da(["viewport-map"],"Save refetched and drawn trip:"+drawnTrip);
            drawnTrip && self.drawnActiveTrips.push(drawnTrip);
          tripCapsule;
      else
        options = {
          strokeColor: 'Grey',
        };
        if(selectedTrip == tripCapsule._id)
          options = {
            strokeColor: 'OrangeRed',
            strokeOpacity: 0.8
          }
        mapComponent.drawActiveTrip tripCapsule, options,  (error, drawnTrip) =>
          #da(["viewport-map"],"Save drawn own trip:"+drawnTrip);
          drawnTrip && @drawnActiveTrips.push(drawnTrip);
        tripCapsule;

    mapComponent.zoomForTrips(trips);
    trips;

  drawTrip: (err, tripCapsule)->
    options = {
      strokeColor: 'Grey',
    };
    if(selectedTrip == tripCapsule._id)
      options = {
        strokeColor: 'OrangeRed',
        strokeOpacity: 0.8
      }
    mapController.drawActiveTrip tripCapsule, options,  (error, drawnTrip) =>
      #da(["viewport-map"],"Save drawn own trip:"+drawnTrip);
      @drawnTrip && @drawnActiveTrips.push(drawnTrip);
    tripCapsule;
