class @CarpoolTripController extends CarpoolController
  layoutTemplate: 'carpoolMapLayout',
  yieldTemplates:
    MapView: to: 'map'

  data: ->
    query = _id: @params.query.trip
    activeTrips = carpoolService.pullActiveTrips query, mapView.setActionProgress.bind(mapView, 'activeTrips')
    #da ["read-trip"], "Active trip", activeTrips
    trip = activeTrips[0]
    mapView.setCurrentTrip trip, ()->
      #da ["read-trip"], "Active trip is shown", activeTrips
    return currentTrip: mapView.trip
