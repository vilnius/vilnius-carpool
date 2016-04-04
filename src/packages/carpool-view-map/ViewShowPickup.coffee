class @ShowPickupController extends CarpoolController
  layoutTemplate: 'onePanelLayout',

  data: ->
    query = _id: @params.query.trip
    trip = carpoolService.pullOneTrip query, mapView.setActionProgress.bind(mapView, 'oneTrip')
    #da ["read-trip"], "Own trip retrieve progress", mapView.getActionProgress();
    if mapView.getActionProgress() isnt 100 then return

    request = _(trip.requests).findWhere userId: Meteor.userId()
    da ["read-trip"], "Request found", request
    pickupStop = request.stop.title;

    mapView.setCurrentTrip trip, ()->
      da ["read-trip"], "Own trip for pickup is shown", trip
      stopsHiglight = {};
      stopsHiglight[request.stop._id] = true
      mapView.showStops trip.stops, stopsHiglight

    result =
      currentTrip: trip
      pickupStop: pickupStop
    return result

Template.ShowPickup.helpers
  tripTitle: ()->
    return TripTitle

Template.ShowPickup.events
  "click .cancelRequest": (event, template) ->
    da ["trip-request"], "Cancel request", @
