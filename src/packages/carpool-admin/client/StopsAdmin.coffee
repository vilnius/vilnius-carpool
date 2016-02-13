class StopsMap
  stopMarkers = [];
  afterMapShown = new ParallelQueue(@);

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

  showStop: afterMapShown.wrap (location)->
    pinImage = new (google.maps.MarkerImage)(
      'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
      new (google.maps.Size)(32, 32),
      new (google.maps.Point)(0, 0), new
      (google.maps.Point)(16, 32));
    toMarker = new (google.maps.Marker)(
      map: @map
      position: googleServices.toLatLng (location)
      icon: pinImage
      draggable: true)


  displayStops: (items)->
    for stop in stopMarkers
      stop.setMap(null);
    for stop in items
      @showStop stop.loc


@stopsMap = new StopsMap

class @StopsAdminController extends AdminController
  subscriptions: ()->
    d "Subscribing"
    [Meteor.subscribe("adminUserContacts"), Meteor.subscribe("adminStops")]

  data: ()->
    d "Stops admin data"
    stops = Stops.find().fetch();
    stopsMap.displayStops stops
    stops: stops;

Template.StopsAdmin.rendered = ->
  d "Stops admin rendered"
  stopsMap.showMap "stops-admin-map", (err, map)->
    google.maps.event.addListener map, 'click', (event)->
      carpoolAdmin.createStop map, event.latLng
