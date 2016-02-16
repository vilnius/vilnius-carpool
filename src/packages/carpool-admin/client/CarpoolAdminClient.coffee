###
  Facade object to hide service implementation details
###
class CarpoolAdmin
  createStop:(map, location) ->
    Stops.insert loc: googleServices.toLocation location

  deleteStop:(id) ->
    Stops.remove {_id: id}

@carpoolAdmin = new CarpoolAdmin
