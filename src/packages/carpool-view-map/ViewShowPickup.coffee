class @ShowPickupController extends CarpoolController
  layoutTemplate: 'onePanelLayout',

  data: ->
    query = _id: @params.query.trip
    trip = carpoolService.pullOneTrip query, mapView.setActionProgress.bind(mapView, 'oneTrip')
    #da ["read-trip"], "Own trip retrieve progress", mapView.getActionProgress();
    if mapView.getActionProgress() isnt 100 then return

    mapView.setCurrentTrip trip, ()->
      da ["read-trip"], "Own trip for pickup is shown", trip
      mapView.showStops trip.stops, []

    result =
      currentTrip: trip
    return result

Template.ShowPickup.helpers
  tripTitle: ()->
    return TripTitle

Template.ShowPickup.events
  "click .cancelRequest": (event, template) ->
    da ["trip-request"], "Cancel request", @
