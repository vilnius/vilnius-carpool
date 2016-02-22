mapPersistQuery = ['aLoc', 'bLoc', 'alert']

# Trip is created as an global object to sustain Controller reloads on url change
trip = new Trip();
Tracker.autorun ()->
  if trip.getFromLatLng()
    location = googleServices.toLocation(trip.getFromLatLng());
    mapComponent.pointALoc(location)
    da ['add-trip'], "Adjusting url according trip A loc:", location
    locStr = googleServices.encodePoints([location]);
    goExtendedQuery {}, {aLoc:locStr}, mapPersistQuery
Tracker.autorun ()->
  if trip.getToLatLng()
    location = googleServices.toLocation(trip.getToLatLng());
    mapComponent.pointBLoc(location)
    da ['add-trip'], "Adjusting url according trip B loc:", location
    locStr = googleServices.encodePoints([location]);
    goExtendedQuery {}, {bLoc:locStr}, mapPersistQuery
@currentTrip = trip

class @MapController extends RouteController
  layoutTemplate: 'mapLayout',
  yieldTemplates:
    MapFullsreenCanvas: to: 'map'

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
    location = undefined
    if @params.query.aLoc
      da ['geoloc'], "Location should be present as been set onBeforeAction", @params.query.abLoc
      location = googleServices.decodePoints(@params.query.aLoc)[0]
    else
      # da ['geoLoc'], "If no url A loc present set from geoIp - and update url"
      location = Session.get("geoIpLoc");
      da ['geoloc'], "Got location from goeIP:", location
    if location
      trip.setALoc(location);

    if @params.query.bLoc
      trip.setBLoc(googleServices.decodePoints(@params.query.bLoc)[0]);

    result =
      currentTrip: trip
      activeTrips:  tripClient.getActiveTrips()
      myTrips: tripClient.getOwnTrips(),


class @MapGroupController extends MapController


Template.MapFullsreenCanvas.rendered = ->
  mapComponent.showMap('streets_map_canvas');

facebookLogin = (event, template) ->
  Meteor.loginWithFacebook (error) ->
    if error
      d "Log in with facebook error: ", error
    else
      nextPage = Session.get("workflow") or "Map"
      d "Login with facebook succesful, redirecting:" + nextPage
      Router.go nextPage

Template.Login.events
  "click .login": (event, template) ->
    user = template.find("#inputUsername").value
    password = template.find("#inputPassword").value
    Meteor.loginWithPassword user, password, (error) ->
      if error
        d "Log in " + user + "  error: " + error.reason
        Session.set "loginError", error.reason
      else
        #d("Logged in");
        Router.go Session.get("workflow") or "Map"
        Session.set "loginError", ""

  "click .facebookLogin": facebookLogin

Template.Register.events
  # TODO dry register and login
  "click .register": (event, template) ->
    name = template.find("#userName").value
    email = template.find("#userEmail").value
    password = template.find("#userPassword").value
    return Session.set("registrationError", "Name" + " should not be empty")  unless Match.test(name, NonEmptyString)
    return Session.set("registrationError", "Email" + " should not be empty")  unless Match.test(email, NonEmptyString)
    return Session.set("registrationError", "Password" + " should not be empty")  unless Match.test(password, NonEmptyString)
    d "Registering:", email
    user =
      email: email
      password: password
      profile:
        name: name
    Accounts.createUser user, (error) ->
      d "Registration of user " + email, error
      unless error
        Router.go Session.get("workflow") or mapWorkflow.start.page
        Session.set "registrationError", ""
      else
        Session.set "registrationError", error.reason


backToHome = (trip) ->
  da ["long-trips"], "Returning back to:", trip.group, ["trip-edit"]
  if trip.group
    group = Groups.findOne(trip.group)
    Router.go "MapGroup",
      niceLink: group.niceLink
  else
    Router.go "Map"

Template.TripAddForm.rendered = ->
  da ['add-trip'],"Map rendered"
  mapComponent.addAutocomplete document.getElementById("trip-toAddress"), (addressText) ->
    da ['add-trip'], "Place B changed:", addressText
    trip.setToAddress addressText

  mapComponent.addAutocomplete document.getElementById("trip-fromAddress"), (addressText) ->
    #d("Place changed:", arguments);
    trip.setFromAddress addressText



Template.TripAddForm.events
  "click .save": (event, template) ->
    di ['add-trip'], 'Adding trip for user:',Meteor.user()
    unless Meteor.user()
      Router.go "Map", {}, {query: extendQuery({aler:"login"}, mapPersistQuery)}
      return
    query = _(trip).pick(["toStreet","toHouse","toCity","toAddress"
      "fromStreet","fromHouse","fromCity", "fromAddress", "time", "path"
    ])
    query._id = trip._id
    da ["trip-saving"], "Saving trip:", query
    #TODO deprecated - tripTime is still used where Trip Class is not used
    query.tripTime = query.time
    da ["viewport-map"], "Saving trip time:" + query._id, query.time
    # for firefox add missing zeros
    query.role = $(event.currentTarget).val()
    query.group = template.data.group and template.data.group._id
    # For automated test trip object is not created
    query.toLoc = [
      trip.getToLatLng().lng()
      trip.getToLatLng().lat()
    ]
    query.fromLoc = [
      trip.getFromLatLng().lng()
      trip.getFromLatLng().lat()
    ]
    $("#save-button").button "loading"
    #TripBusinessLogic.saveTrip query, (error, value) ->
    carpoolService.saveTrip query, (error, value) ->
      $("*[id^='trip-to']").val ""
      Session.set "toLngLat", `undefined`
      $("#save-button").button "reset"
      #d("Selecting saved trip", value);
      Session.set "selectedTrip", value

    #da(['viewport-map'],"Show starting page"+trip, template.data.params);
    backToHome trip


Meteor.startup () =>
  #da(['geoloc'], "Getting current location");
  if "geolocation" of navigator
    #d("Geolocation is available");
    navigator.geolocation.getCurrentPosition (location) ->
      #latlng = new google.maps.LatLng(location.coords.latitude, location.coords.longitude)
      da ['geoloc'], "Setting location:", location.coords
      Session.set("geoIpLoc", [location.coords.longitude, location.coords.latitude]);
