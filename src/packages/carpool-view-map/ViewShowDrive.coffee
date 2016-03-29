class @ShowDriveController extends CarpoolController
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
    return result

Template.ShowDrive.helpers
  tripTitle: ()->
    return TripTitle

Template.ShowDrive.events
  "click .acceptRequest": (event, template) ->
    da ["trip-request"], "Accept request", @
    carpoolService.acceptRequest @id, "accept"
