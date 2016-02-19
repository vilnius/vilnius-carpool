reactivate = (obj, property)->
  depName = 'dep'+ (property[0].toUpperCase() + property[1..-1].toLowerCase())
  obj.prototype[depName] = new Tracker.Dependency;
  getterName = 'get'+ (property[0].toUpperCase() + property[1..-1].toLowerCase())
  obj.prototype[getterName] = new Function("", 'this["'+depName+'"].depend(); return this["'+property+'"];');
  setterName = 'set'+ (property[0].toUpperCase() + property[1..-1].toLowerCase())
  obj.prototype[setterName] = new Function("value", 'this["'+depName+'"].changed(); return this["'+property+'"]=value;');

class Location
  address: null
  latlng: null;

reactivate(Location, "latlng");

class CarpoolTrip
  time: new Date();
  from: new Location
  to: new Location

  getTime: () ->
    return @time

class MapView
  afterMapShown = new ParallelQueue(@);
  trip: new CarpoolTrip();
  toMarker: null;
  fromMarker: null;

  # Shows Google Map when all required libraries are ready and starts afterMapShown queue
  showMap: (id, cb)->
    mapElement = document.getElementById(id);
    # This method is called after google services are initialized
    googleServices.afterInit =>
      myOptions =
        zoom: 12
        center: new (google.maps.LatLng)(54.67704, 25.25405)
        mapTypeId: google.maps.MapTypeId.ROADMAP
      @map = new (google.maps.Map)(mapElement, myOptions)
      cb(null, @map);
      afterMapShown.start();
  # Automcomplete requires map to be initialized
  addAutocomplete: afterMapShown.wrap (input, cb)->
    googleServices.addAutocomplete input, @map, cb
  clarifyPlace: (latlng, address, cb)->
    #d "Clarify place", address
    googleServices.getGeocoder().geocode { 'address': address }, (error, result) ->
      if !error and result.length > 0
        cb?(null, result[0].geometry.location, address)
      else
        cb?(error)
  setCurrentTripTo: (err, latlng, address, place)=>
    #d "Set current trip to", address
    setToLatLng = (refinedLatlng, refinedAddress)=>
      @trip.to.setLatlng(refinedLatlng)
      @trip.to.address = refinedAddress
      @dropToMarker @trip.to.latlng
    if not latlng then @clarifyPlace location, address, (err, refinedLatlng, refinedAddress)=>
      d "Refined latlng #{refinedAddress}:", refinedLatlng,
      setToLatLng(refinedLatlng, refinedAddress) unless err
    else
      setToLatLng(latlng, address)
  dropToMarker: (latlng)->
    if not @toMarker
      pinImage = new (google.maps.MarkerImage)('http://maps.google.com/mapfiles/ms/icons/green-dot.png', new (google.maps.Size)(32, 32), new (google.maps.Point)(0, 0), new (google.maps.Point)(16, 32))
      toMarker = new (google.maps.Marker)(
        map: @map
        position: latlng
        icon: pinImage
        draggable: true)
    else
      @toMarker.setPosition(location);
  setCurrentTripFrom: (err, latlng, address, place)=>
    #d "Set current trip to", address
    setFromLatLng = (refinedLatlng, refinedAddress)=>
      #d "Refine latlng", refinedLatlng
      @trip.from.setLatlng(refinedLatlng)
      @trip.from.address = refinedAddress
      @dropFromMarker @trip.from.latlng
    if not latlng then @clarifyPlace location, address, (err, refinedLatlng, refinedAddress)=>
      setFromLatLng(refinedLatlng, refinedAddress) unless err
    else
      setFromLatLng(latlng, address)
  dropFromMarker: (latlng)->
    if not @fromMarker
      pinImage = new (google.maps.MarkerImage)('http://maps.google.com/mapfiles/ms/icons/red-dot.png', new (google.maps.Size)(32, 32), new (google.maps.Point)(0, 0), new (google.maps.Point)(16, 32))
      fromMarker = new (google.maps.Marker)(
        map: @map
        position: latlng
        icon: pinImage
        draggable: true)
    else
      @toMarker.setPosition(location);


@mapView = new MapView

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

    @activeTripsSub = Meteor.subscribe("activeTrips", @params.niceLink, query)
    @ownTripsSub =  Meteor.subscribe("ownTrips",@params.niceLink)

    da(['data-publish'], "1. Subscribing for active trips:"+Meteor.userId()+"@"+@params.niceLink, query);
    if @activeTripsSub.ready()
      da(['data-publish'], "3. Subscribtion active trips is ready:", query);
      tripClient.setActionProgress('activeTrips',100);
      this.next();
    else
      da(['data-publish'], "2. Wait for subscribtion to the active trips:", query);
      tripClient.setActionProgress('activeTrips',0);

    if(@ownTripsSub.ready())
      da(['data-publish'], "5. Subscribtion own trips is ready:"+@params.niceLink, query);
      tripClient.setActionProgress('ownTrips',100);
    else
      da(['data-publish'], "4. Wait for subscribtion to own trips:"+@params.niceLink, query);
      tripClient.setActionProgress('ownTrips',0);

  data: ->
    result =
      currentTrip: mapView.trip
      activeTrips:  carpoolService.getActiveTrips()
      myTrips: tripClient.getOwnTrips(),

###
  Meteor templates for UI
###
Template.MapView.rendered = ->
  #d "Stops admin rendered"
  mapView.showMap "map_canvas", (err, map)->
    #d "Map shown"
