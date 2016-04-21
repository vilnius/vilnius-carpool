class @MuiRequestRideController extends RouteController
  data: ->
    result =
      currentTrip: @params.query.trip

Template.MuiRequestRide.helpers
  requestRide: ()->
    return RequestRideScreen
