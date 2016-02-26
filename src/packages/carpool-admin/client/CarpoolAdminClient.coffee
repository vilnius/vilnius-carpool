###
  Facade object to hide service implementation details
###
class CarpoolAdmin
  createStop:(latlng, title) ->
    da ["admin-stops"], "Create stop", latlng
    location = googleServices.toLocation latlng
    unless title
      title = "#{location[0].toFixed(4)}, #{location[1].toFixed(4)}"
    Stops.insert loc: location, title: title

  deleteStop:(id) ->
    Stops.remove {_id: id}

@carpoolAdmin = new CarpoolAdmin
