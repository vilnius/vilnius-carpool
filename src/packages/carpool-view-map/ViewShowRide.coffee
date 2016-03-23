Template.ShowRide.helpers
  tripTitle: ()->
    return TripTitle


class @ShowRideController extends CarpoolController
  layoutTemplate: 'onePanelLayout',

  data: ->
    # Fetch your own ride
    query = _id: @params.query.trip
    ownTrips  = carpoolService.pullOwnTrips query, mapView.setActionProgress.bind(mapView, 'ownTrips')
    trip = ownTrips[0]
    mapView.setCurrentTrip trip, ()->
      da ["read-trip"], "Own trip is shown", trip
    result =
      currentTrip: trip
    if trip
      activeTrips = carpoolService.pullActiveTrips trip, mapView.setActionProgress.bind(mapView, 'activeTrips')
      da ["read-trip"], "Active trips filtered", activeTrips
      result.activeTrips = activeTrips 
    return result
