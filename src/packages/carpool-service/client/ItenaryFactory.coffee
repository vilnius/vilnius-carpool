d = console.log.bind console

class @ItenaryFactory
  ###
     Rider itenary consist from
       A point
       pickup stop
       dropoff stop
       B point
    TODO calculate times correctly for stops
  ###
  @createRiderItenary = (ride, drive)->
    itenary = [];
    if ride
      itenary.push
        _id: "#{ride._id}-rA",
        name: "rA",
        address: ride.fromAddress,
        time: ride.aTime,
        loc: ride.fromLoc,
        title: 'From',
    else if drive
      itenary.push
        _id: "#{drive._id}-dA",
        name: "dA",
        address: drive.fromAddress,
        time: drive.aTime,
        loc: drive.fromLoc,
        title: 'From',

    # d "Drive for ride:", drive
    if drive and ride
      # Nearest stop from A point for pickup
      aStop = loc: drive.fromLoc, title: drive.fromAddress, _id: "#{drive._id}-sA"
      stop = _([drive.stops..., aStop]).min (item) ->
        getDistance ride.fromLoc, item.loc
      itenary.push
        _id: "#{stop._id}-st",
        name: "sA",
        loc: stop.loc,
        title: stop.title,
      # Nearest stop from B point to drop-off
      bStop = loc: drive.toLoc, title: drive.toAddress, _id: "#{drive._id}-sB"
      stop = _([drive.stops..., bStop]).min (item) ->
        getDistance ride.toLoc, item.loc
      itenary.push
        _id: "#{stop._id}-st",
        name: "sB",
        loc: stop.loc,
        title: stop.title,

    if ride
      itenary.push
        _id: "#{ride._id}-rB",
        name: "rB",
        address: ride.toAddress,
        time: ride.bTime,
        loc: ride.toLoc,
        title: 'To'
    else if drive
      itenary.push
        _id: "#{drive._id}-dB",
        name: "dB",
        address: drive.toAddress,
        time: drive.bTime,
        loc: drive.toLoc,
        title: 'To',


    return itenary

  ###
     Driver itenary consist from
       A point
       stops where to pickup riders
       B point
    TODO show only pick-up stops
  ###
  @createDriverItenary = (drive)->
    itenary = [];
    itenary.push({
      _id: drive._id+"-dA",
      name: "dA",
      address: drive.fromAddress,
      time: drive.aTime,
      loc: drive.fromLoc,
      title: 'From',
    });
    # First stop is the same as dA
    for stop in drive.stops[1..]
      itenary.push
        _id: stop._id+"-st",
        name: "st",
        address: stop.title,
        loc: stop.loc,
        time: undefined,
        title: stop.title,
    itenary.push
      _id: drive._id+"-dB",
      name: "dB",
      address: drive.toAddress,
      time: drive.bTime,
      loc: drive.toLoc,
      title: 'To',
    return itenary;
