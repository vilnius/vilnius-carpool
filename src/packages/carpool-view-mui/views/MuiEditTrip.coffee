Template.MuiEditTrip.rendered = ->
  #d "MuiEditTrip rendered"

  tripFormInputFrom = document.getElementById("trip-form-input-from")
  mapView.addAutocomplete tripFormInputFrom, (err, latlng, address, place)->
    mapView.setCurrentTripFrom err, latlng, address, place, (refinedLatlng, refinedAddress)->
      updateUrl "aLoc", refinedLatlng

  tripFormInputTo = document.getElementById("trip-form-input-to")
  mapView.addAutocomplete tripFormInputTo, (err, latlng, address, place)->
    mapView.setCurrentTripTo err, latlng, address, place, (refinedLatlng, refinedAddress)->
      updateUrl "bLoc", refinedLatlng

Template.MuiEditTrip.helpers
   tripForm: ()->
     return TripForm
