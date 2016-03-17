Template.CarpoolTrip.rendered = ->
  toAddressElement = document.getElementById("trip-toAddress")
  mapView.addAutocomplete toAddressElement, (err, latlng, address, place)->
    # Google services for some reasone doesn't provide latlng
    mapView.setCurrentTripTo err, latlng, address, place, (refinedLatlng, refinedAddress)->
      updateUrl "bLoc", refinedLatlng
  fromAddressElement = document.getElementById("trip-fromAddress")
  mapView.addAutocomplete fromAddressElement, (err, latlng, address, place)->
    mapView.setCurrentTripFrom err, latlng, address, place, (refinedLatlng, refinedAddress)->
      updateUrl "aLoc", refinedLatlng

  tripFormInputFrom = document.getElementById("trip-form-input-from")
  mapView.addAutocomplete tripFormInputFrom, (err, latlng, address, place)->
    mapView.setCurrentTripFrom err, latlng, address, place, (refinedLatlng, refinedAddress)->
      updateUrl "aLoc", refinedLatlng

  tripFormInputTo = document.getElementById("trip-form-input-to")
  mapView.addAutocomplete tripFormInputTo, (err, latlng, address, place)->
    mapView.setCurrentTripTo err, latlng, address, place, (refinedLatlng, refinedAddress)->
      updateUrl "bLoc", refinedLatlng

Template.CarpoolTrip.helpers
   tripForm: ()->
     return TripForm
