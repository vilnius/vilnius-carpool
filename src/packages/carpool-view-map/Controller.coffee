@mapPersistQuery = ['aLoc', 'bLoc', 'alert', 'trip']
locRadiusFilter = 1000 * 180 / (3.14*6371*1000);

@updateUrl = (param, latlng)->
  location = googleServices.toLocation(latlng);
  locStr = googleServices.encodePoints([location]);
  params = {};
  params[param] = locStr
  goExtendedQuery {}, params, mapPersistQuery

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
    @next();

  data: ->
    @ownTripsSub =  Meteor.subscribe("ownTrips",@params.niceLink)
    @stopsSubs = Meteor.subscribe("stops");
    @dataLoading = 3

    if(@ownTripsSub.ready())
      da(['data-publish-ownTrips'], "5. Subscribtion own trips is ready");
      mapView.setActionProgress('ownTrips',100);
      @dataLoading--
    else
      da(['data-publish-ownTrips'], "4. Wait for subscribtion to own trips");
      mapView.setActionProgress('ownTrips',0);
    if(@stopsSubs.ready())
      @dataLoading--
    else
      mapView.setActionProgress('ownTrips',0);

    ###
    if @dataLoading
      # If not ready show only map
      @render("MapView", {to: 'map'});
    else
    da ['trips-filter', 'data-publish'], "Carpoolmap subcribtions to load:"+@dataLoading
    ###

    # Filter trips by parameters in query - these are set then trip form is filled
    query = {}
    if @params.query.aLoc
      da ['geoloc'], "Location present in url has biggest priority:", @params.query.aLoc
      aLoc = googleServices.decodePoints(@params.query.aLoc)[0]
      query["fromLoc"] = aLoc
      googleServices.afterInit ()=>
        latlng = googleServices.toLatLng(aLoc)
        da ["trips-filter"], "Update A location", aLoc
        mapView.setCurrentTripFrom null, latlng, null, null, (refinedLatlng, refinedAddress)->
          # TODO check why this can't be moved to mapView
          da ["trips-filter"], "Update A address", refinedAddress
          mapView.trip.from.setAddress(refinedAddress)
    if @params.query.bLoc
      da ['geoloc'], "Location present in url has biggest priority:", @params.query.bLoc
      bLoc = googleServices.decodePoints(@params.query.bLoc)[0]
      query["toLoc"] = bLoc
      googleServices.afterInit ()=>
        latlng = googleServices.toLatLng(bLoc)
        da ["trips-filter"], "Update B location", bLoc
        mapView.setCurrentTripTo null, latlng, null, null, (refinedLatlng, refinedAddress)->
          # TODO check why this can't be moved to mapView
          da ["trips-filter"], "Update B address", refinedAddress
          mapView.trip.to.setAddress(refinedAddress)

    activeTrips = carpoolService.pullActiveTrips query, (progress)=>
      if 100 == progress
        da(['data-publish'], "3. Subscribtion active trips is ready:", query);
        mapView.setActionProgress('activeTrips', 100);
        @dataLoading--
      else
        da(['data-publish'], "2. Wait for subscribtion to the active trips:", query);
        mapView.setActionProgress('activeTrips',0);

    return if @dataLoading;

    #activeTrips = carpoolService.getActiveTrips().fetch()
    da ['data-publish'], "7. Draw active trips:", activeTrips
    stopsOnRoutes = {};
    da ["stops-drawing"], "Collect the stops to be marked"
    for trip in activeTrips
      da ["stops-drawing"], "Trip stops", trip.stops
      stopsOnRoutes[stop._id] = stop for stop in trip.stops
      mapView.drawActiveTrip trip
    mapView.invalidateActiveTrips(_(activeTrips).pluck("_id"));

    ownTrips = carpoolService.getOwnTrips().fetch()
    da ['data-publish-ownTrips','stops-drawing'], "Draw own trips:", ownTrips
    for trip in ownTrips
      stopsOnRoutes[stop._id] = stop for stop in trip.stops
      mapView.drawOwnTrip trip
    mapView.invalidateOwnTrips(_(ownTrips).pluck("_id"));

    stops = carpoolService.getStops();
    #da ["stops-drawing"], "Controller stops", stops
    mapView.showStops stops, stopsOnRoutes

    # Redraw trip on top
    if @params.query.trip?
      da ["trips-matcher"], "Highlight selected trip: #{@params.query.trip}"
      trip = _(activeTrips).findWhere({_id: @params.query.trip})
      mapView.selectTrip(trip);

    result =
      currentTrip: mapView.trip
      activeTrips: activeTrips
      myTrips: ownTrips
      stops: stops
      selectedTrip: @params.query.trip

@selectTrip = (tripId)->
  da ["trips-matcher"], "Selected trip #{tripId}", tripId
  goExtendedQuery {}, {trip: tripId}, mapPersistQuery
