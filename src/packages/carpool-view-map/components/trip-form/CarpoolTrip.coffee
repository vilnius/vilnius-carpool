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

Template.CarpoolTrip.helpers
   tripForm: ()->
     return TripForm
