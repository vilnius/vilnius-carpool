class @CarpoolController extends RouteController
  layoutTemplate: 'carpoolMapLayout',
  yieldTemplates:
    MapView: to: 'map'

class @RegisterController extends CarpoolController
  layoutTemplate: 'carpoolMapLayout',
  yieldTemplates:
    MapView: to: 'map'

class @CarpoolMapController extends CarpoolController
  layoutTemplate: 'carpoolMapLayout',
  yieldTemplates:
    MapView: to: 'map'

  onBeforeAction: ()->
    unless Meteor.userId()
      da ['data-publish'], "0. No user, nothing to subscribe", Meteor.userId();
      @render("MapView", {to: 'map'});
      @render("CarpoolLogin");
      return

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

    @activeTripsSub = Meteor.subscribe("activeTrips", @params.niceLink, query)
    @ownTripsSub =  Meteor.subscribe("ownTrips",@params.niceLink)
    @stopsSubs = Meteor.subscribe("stops");

    @dataLoading = 3
    da(['data-publish'], "1. Subscribing for active trips:"+Meteor.userId()+"@"+@params.niceLink, query);
    if @activeTripsSub.ready()
      da(['data-publish'], "3. Subscribtion active trips is ready:", query);
      mapView.setActionProgress('activeTrips', 100);
      @dataLoading--
    else
      da(['data-publish'], "2. Wait for subscribtion to the active trips:", query);
      mapView.setActionProgress('activeTrips',0);
    if(@ownTripsSub.ready())
      da(['data-publish'], "5. Subscribtion own trips is ready:"+@params.niceLink, query);
      mapView.setActionProgress('ownTrips',100);
      @dataLoading--
    else
      da(['data-publish'], "4. Wait for subscribtion to own trips:"+@params.niceLink, query);
      mapView.setActionProgress('ownTrips',0);
    if(@stopsSubs.ready())
      @dataLoading--
    else
      mapView.setActionProgress('ownTrips',0);
    if @dataLoading
      # If not ready show only map
      @render("MapView", {to: 'map'});
    else
      @next();

  data: ->
    return if @dataLoading;
    da(['data-publish'], "6. Preparing data for CarpoolMap:"+@params.niceLink);
    activeTrips = carpoolService.getActiveTrips().fetch()
    da ['data-publish','stops-drawing'], "Draw active trips:", activeTrips
    stopsOnRoutes = {};
    da ["stops-drawing"], "Collect the stops to be marked"
    for trip in activeTrips
      da ["stops-drawing"], "Trip stops", trip.stops
      stopsOnRoutes[stop._id] = stop for stop in trip.stops
      mapView.drawActiveTrip trip
    mapView.invalidateActiveTrips(_(activeTrips).pluck("_id"));

    ownTrips = carpoolService.getOwnTrips().fetch()
    da ['data-publish','stops-drawing'], "Draw own trips:", ownTrips
    for trip in ownTrips
      stopsOnRoutes[stop._id] = stop for stop in trip.stops
      mapView.drawOwnTrip trip
    mapView.invalidateOwnTrips(_(ownTrips).pluck("_id"));

    stops = carpoolService.getStops();
    #da ["stops-drawing"], "Controller stops", stops
    mapView.showStops stops, stopsOnRoutes

    result =
      currentTrip: mapView.trip
      activeTrips: activeTrips
      myTrips: ownTrips
      stops: stops
