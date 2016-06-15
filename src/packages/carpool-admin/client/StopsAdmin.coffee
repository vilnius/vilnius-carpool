###
  UI Object to hide Google Maps handling logic
###
class StopsMap
  stopMarkers = [];
  afterMapShown = new ParallelQueue(@);

  # Shows Google Map when all required libraries are ready and starts afterMapShown queue
  showMap: (id, cb)->
    mapElement = document.getElementById(id);
    d "This method is called after google services are initialized"
    googleServices.afterInit =>
      d "Show admin stops map", mapElement
      myOptions =
        zoom: 12
        center: new (google.maps.LatLng)(54.67704, 25.25405)
        mapTypeId: google.maps.MapTypeId.ROADMAP
      @map = new (google.maps.Map)(mapElement, myOptions)
      cb(null, @map);
      afterMapShown.start();

  # Method wrapped in queue, wich is actived only then map is ready
  showStop: afterMapShown.wrap (stop)->
    pinImage = new (google.maps.MarkerImage)(
      'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
      new (google.maps.Size)(32, 32),
      new (google.maps.Point)(0, 0), new
      (google.maps.Point)(16, 32));
    stopMarker = new (google.maps.Marker)(
      map: @map
      position: googleServices.toLatLng (stop.loc)
      icon: pinImage
      title: stop.title
      _id: stop._id
      draggable: true)
    stopMarkers.push stopMarker
    stopMarker.addListener 'click', ()->
      stopId = @get("_id");
      $("#stop-#{stopId}").collapse('show')

  # Not optimized version to redraw markers - simply removes old and adds new
  displayStops: (items)->
    for stop in stopMarkers
      stop.setMap(null);
    for stop in items
      @showStop stop

@stopsMap = new StopsMap

###
  Controller to load stops
###
Template.StopsAdmin.onCreated ()->
  @autorun ()=>
    @subscribe "adminStops"

Template.StopsAdmin.helpers
  stops: ()->
    #d "Stops admin data"
    stops = Stops.find().fetch();
    stopsMap.displayStops stops
    return stops;

###
  Meteor templates for UI
###
Template.StopsAdmin.rendered = ->
  #d "Stops admin rendered"
  stopsMap.showMap "stops-admin-map", (err, map)->
    google.maps.event.addListener map, 'click', (event)->
      da ["admin-stops"], "Clicked", event
      carpoolAdmin.createStop event.latLng

Template.StopsAdmin.events
  "click .removeStop": (event, template) ->
    #d "Remove #{@_id}"
    carpoolAdmin.deleteStop @_id
