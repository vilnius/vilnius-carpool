Template.ShowRide.helpers
  tripTitle: ()->
    return TripTitle


class @ShowRideController extends CarpoolTripController
  layoutTemplate: 'onePanelLayout',

  data: ->
    result = _(super()).extend({
    })
    #d "React TripTitle", result
    return result
