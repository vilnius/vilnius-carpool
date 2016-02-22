class @CarpoolController extends RouteController
  layoutTemplate: 'carpoolMapLayout',
  yieldTemplates:
    MapView: to: 'map'

class @CarpoolLoginController extends CarpoolController

class @CarpoolMapController extends CarpoolController

  onBeforeAction: ()->
    query = {}
    location = undefined
    if @params.query.aLoc
      da ['geoloc'], "Location present in url has biggest priority:", @params.query.abLoc
      location = googleServices.decodePoints(@params.query.aLoc)[0]

    if location
      radius = 50*1000;
      f = radius * 180 / (3.14*6371*1000);
      query["address.location"] =
        $near : location,
        $maxDistance : f;

    console.log "Router", @

    @activeTripsSub = Meteor.subscribe("activeTrips", @params.niceLink, query)
    @ownTripsSub =  Meteor.subscribe("ownTrips",@params.niceLink)
    @stopsSubs = Meteor.subscribe("stops");

    da(['data-publish'], "1. Subscribing for active trips:"+Meteor.userId()+"@"+@params.niceLink, query);
    if @activeTripsSub.ready()
      da(['data-publish'], "3. Subscribtion active trips is ready:", query);
      mapView.setActionProgress('activeTrips',100);
      this.next();
    else
      da(['data-publish'], "2. Wait for subscribtion to the active trips:", query);
      mapView.setActionProgress('activeTrips',0);

    if(@ownTripsSub.ready())
      da(['data-publish'], "5. Subscribtion own trips is ready:"+@params.niceLink, query);
      mapView.setActionProgress('ownTrips',100);
    else
      da(['data-publish'], "4. Wait for subscribtion to own trips:"+@params.niceLink, query);
      mapView.setActionProgress('ownTrips',0);

  data: ->
    result =
      currentTrip: mapView.trip
      activeTrips:  carpoolService.getActiveTrips()
      stops: carpoolService.getStops();
      #myTrips: tripClient.getOwnTrips(),
