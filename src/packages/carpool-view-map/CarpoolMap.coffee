Template.CarpoolMap.rendered = ->
  toAddressElement = document.getElementById("trip-toAddress")
  mapView.addAutocomplete toAddressElement, mapView.setCurrentTripTo
  fromAddressElement = document.getElementById("trip-fromAddress")
  mapView.addAutocomplete fromAddressElement, mapView.setCurrentTripFrom

Template.CarpoolMap.events
  "click .save": (event, template) ->
    trip = template.data.currentTrip
    query =
      _id: trip._id
      role: $(event.currentTarget).val()
      group: template.data.group and template.data.group._id
      toLoc: googleServices.toLocation trip.to.latlng
      fromLoc: googleServices.toLocation trip.from.latlng
      toAddress: trip.to.address
      fromAddress: trip.from.address
      time: new Date()

    #da ["trip-saving"], "Saving trip:", query
    d "Saving trip:", query
    $("#save-button").button "loading"

    carpoolService.saveTrip query, (error, value) ->
      $("*[id^='trip-toAddress']").val ""
      $("#save-button").button "reset"
