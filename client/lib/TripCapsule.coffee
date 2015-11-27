class @Trip
  #_id: null
  time: null
  tripTime: null
  toHouse: null
  toStreet: null
  toCity: null
  toLatLng: null
  fromHouse: null
  fromStreet: null
  fromCity: null
  fromLatLng: null
  # use this instead of toHouse toStreet toCity
  toAddress: null
  fromAddress: null;

  constructor: (source) ->
    @oid = new Meteor.Collection.ObjectID()
    @time = new Date()
    #d "Create a Deps.Dependency for each reactive variable.", @toAddress
    @_deps = {}
    @_deps['time'] = new Deps.Dependency
    @_deps['tripTime'] = new Deps.Dependency
    @_deps['toAddress'] = new Deps.Dependency()
    @_deps['toLatLng'] = new Deps.Dependency
    @_deps['fromAddress'] = new Deps.Dependency
    @_deps['fromLatLng'] = new Deps.Dependency
    @_deps['role'] = new Deps.Dependency
    @_deps['path'] = new Deps.Dependency

    #da ['async-capsule', 'trip-edit'], "TripCapsule constructor #{@oid}: ", source
    if source
      #da ['async-capsule','trip-saving'], "Copy to TripCapsule:"+@, source
      _.extend(@, _.clone(source));
    #da ['async-capsule','trip-saving'], "Result of TripCapsule:"+@
    #if not @toLoc then   e "TripCapsule:"+@

  # reactive getters and setters
  getTime: () ->
    @_deps['time'].depend()
    #e "Get time:"+@time
    return @time
  setTime: (value) ->
    return if value is @time
    @time = value
    #da ['viewport-map'], "Set time:"+@toString()
    @_deps['time'].changed()

  getRole: () ->
    @_deps['role'].depend()
    return @role
  setRole: (value) ->
    #d "Setting role", value
    return if value is @role
    @role = value
    @_deps['role'].changed()

  getTripTime: () ->
    @_deps['tripTime'].depend()
    return @tripTime
  setTripTime: (value) ->
    return if value is @tripTime
    #da ['viewport-map'], "Setting trip time:"+@toString
    @tripTime = value
    @_deps['tripTime'].changed()

  getToAddress: () ->
    @_deps.toAddress.depend()
    #d "getToAddress", @toAddress
    return @toAddress || ''

  setToAddress: (house, street, city) ->
    #d "Set address:"+arguments.length, arguments
    if arguments.length == 1
      return if @toAddress == house
      @toAddress = house
      googleServices.getGeocoder().geocode {'address':@toAddress}, (err, result)=>
        if not err && result.length > 0
          # This trigers adress to be parsed in house street and city
          @toLatLng = result[0].geometry.location
          @path = ""
          @_deps['toLatLng'].changed()
    else
      return if @toHouse is house and @toStreet is street and @toCity is city
      @toHouse = house
      @toStreet = street
      @toCity = city
      #if address changed update latlng
      mapController.getAddressLatLng house, street, city, (err, latlng) =>
        @toLatLng = latlng;

  getToLatLng: () ->
    @_deps['toLatLng'].depend()
    return @toLatLng

  setBLoc: googleServices.postInit.wrap (location)->
    latlng = googleServices.toLatLng(location);
    da ['trip-capsule'], "Set new location:"+location, latlng
    @setToLatLng(latlng);


  setToLatLng: (latlng) ->
    if @toLatLng
      return if latlng? and @toLatLng.equals(latlng);
    da ['trip-capsule'], "Set new toLatLng:"+@, @toLatLng
    @toLatLng = latlng
    @path = ""
    @_deps['toLatLng'].changed()
    googleServices.getGeocoder().geocode {'latLng': latlng}, (err, results)=>
      if not err && results.length > 0
        #di ['trip-capsule'],"Geocoder returned address for B:" + latlng, results
        address = {};
        for addressLine in results[0].address_components
          #addressLine = results[0].address_components[l];
          address[addressLine.types[0]] = addressLine.short_name;
        @toHouse = address.street_number||""
        @toStreet = address.route||""
        @toCity = address.locality||""
        @toAddress = @toStreet+" "+@toHouse+","+@toCity
        da ['trip-capsule'], "Set edit trip B address:", @toAddress
        @_deps['toAddress'].changed()

  getFromAddress: () ->
    @_deps['fromAddress'].depend()
    #d "getFromAddress", @fromAddress
    return @fromAddress || ''

  setFromAddress: (house, street, city) ->
    #d "Set address:"+arguments.length, arguments
    if arguments.length == 1
      return if @fromAddress == house
      @fromAddress = house
      mapController.setFromAddress @fromAddress, (latlng) =>
        # This trigers adress to be parsed in house street and city
        @setFromLatLng(latlng);
    else
      return if @fromHouse is house and @fromStreet is street and @fromCity is city
      @fromHouse = house
      @fromStreet = street
      @fromCity = city
      #if address changed update latlng
      mapController.getAddressLatLng house, street, city, (err, latlng) =>
        @fromLatLng = latlng;

  getFromLatLng: () ->
    @_deps['fromLatLng'].depend()
    return @fromLatLng

  setALoc: googleServices.postInit.wrap (location)->
    latlng = googleServices.toLatLng(location);
    @setFromLatLng(latlng);

  setFromLatLng: (latlng) ->
    if @fromLatLng
      #da ['long-trips'], "New fromLatLng value: #{(latlng?)}/#{@fromLatLng.lat() == latlng.lat()}<=#{@fromLatLng.lat()}==#{latlng.lat()}"
      return if latlng? and @fromLatLng.lat() == latlng.lat() and @fromLatLng.lng() == latlng.lng();
    da ['trip-capsule'], "Set new fromLatLng:"+@, latlng
    @fromLatLng = latlng
    @path = ""
    @_deps['fromLatLng'].changed()
    googleServices.getGeocoder().geocode {'latLng': latlng}, (err, results)=>
      if not err && results.length > 0
        #di ['trip-capsule'],"Geocoder returned address for A:" + latlng, results
        address = {};
        for addressLine in results[0].address_components
          #addressLine = results[0].address_components[l];
          address[addressLine.types[0]] = addressLine.short_name;
        @fromHouse = address.street_number||""
        @fromStreet = address.route||""
        @fromCity = address.locality||""
        @fromAddress = @fromStreet+" "+@fromHouse+","+@fromCity
        da ['trip-capsule'], "Set edit trip A address:", @fromAddress
        @_deps['fromAddress'].changed()


  getPath: ()->
    @_deps['path'].depend()
    return @path

  ###
    Refetch requires latlng to be initialized
  ###
  refetch: (collection, cb) ->
    da ['async-capsule'], "Refetch queue:"+@
    queue = new ParallelQueue(@);
    queue.wrap(@_createToLatLng)();
    queue.wrap(@_createFromLatLng)();
    queue.wrap(@_refetchToLatLng)(collection);
    queue.wrap(@_refetchFromLatLng)(collection);
    queue.purge ()=>
      da ['async-capsule'], "To/From latlng retrieved:"+@
      @_refetchAddresses collection, cb
    @

  _createFromLatLng: (cb) ->
    if @fromLoc
      if not @fromLatLng
        mapController.createLatLng @fromLoc, (err, result) =>
          #da ['async-capsule'], "TripCapsule updated fromLatlng for:"+result
          @fromLatLng = result
          cb(null, result)
      else
        #d "_createFromLatLng, ", cb
        cb(null, @fromLatLng)
    else
     #da ['async-capsule'], "TripCapsule has no fromLoc"
     cb(null, null)

  _createToLatLng: (cb) ->
    if @toLoc?
      if not @toLatLng?
        mapController.createLatLng @toLoc, (err, result) =>
          #da ['async-capsule'], "TripCapsule updated toLatlng for:"+result
          @toLatLng = result
          cb(null, result)
      else
        #da ['async-capsule'], "TripCapsule has toLatlng for:"+@toLatLng
        cb(null, @toLatLng)
    else
     #da ['async-capsule'], "TripCapsule has no toLoc"
     cb(null, null)


  _refetchToLatLng: (collection, cb)->
    if @_id? and not @toLatLng? and @toCity?
      da ['async-capsule', 'long-trips'], "TripCapsule has no toLatLng, but toCity :"+@toCity
      mapController.getAddressLatLng @toHouse || "", @toStreet  || "", @toCity, (err, latlng) =>
        da ['async-capsule', 'map-bridge'], "TripCapsule got latlng for:"+@_id, latlng
        if err then return cb(null, null)
        @toLatLng = latlng
        collection.update({_id: @_id}, {$set: {toLoc: [latlng.lng(), latlng.lat()]}})
        da ['async-capsule', 'map-bridge'], "TripCapsule updated toLoc for:"+@
        cb(null, @toLatLng)
    else
      da ['async-capsule', 'long-trips'], "TripCapsule no refetch for toLatLng:"+@
      cb(null, @toLatLng)

  _refetchFromLatLng: (collection, cb)->
    if @_id? and not @fromLatLng? and @fromCity?
      da ['async-capsule', 'long-trips'], "TripCapsule has no fromLatLng, but fromCity :"+@fromCity
      mapController.getAddressLatLng @fromHouse || "", @fromStreet  || "", @fromCity, (err, latlng) =>
        da ['async-capsule', 'map-bridge'], "TripCapsule got latlng for:"+@_id, latlng
        if err then return cb(null, null)
        @fromLatLng = latlng
        collection.update({_id: @_id}, {$set: {fromLoc: [latlng.lng(), latlng.lat()]}})
        da ['async-capsule', 'map-bridge'], "TripCapsule updated fromLoc for:"+@
        cb(null, @fromLatLng)
    else
      da ['async-capsule', 'long-trips'], "TripCapsule no refetch for fromLatLng:"+@
      cb(null, @fromLatLng)

  _refetchAddresses: (collecion, cb)->
    self = @
    da ['async-capsule'], "Preparing to refetch:"+@
    if @_id? and not @toAddress and @toLoc
      da ['async-capsule'], "Missing toAddress:"+@toLatLng
      mapComponent.getLatLngAddress @toLatLng, (err, address) =>
        if not err
          @toHouse = address.street_number||""
          @toStreet = address.route||""
          @toCity = address.locality||""
          @toAddress = @toStreet+" "+@toHouse+","+@toCity
          #da ['map-bridge','async-capsule'], "Set to address by loc:"+@, @toAddress
          collecion.update({_id: self._id}, {$set: {toAddress: @toAddress, toHouse: @toHouse, toStreet: @toStreet, toCity: @toCity}})
        else
          e "Fetching toAddress error"+err

    if @_id? and not @fromAddress and @fromLoc
      da ['async-capsule'], "Missing fromAddress:"+@fromLatLng
      mapController.getLatLngAddress @fromLatLng, (err, address) =>
        if not err
          @fromHouse = address.street_number||""
          @fromStreet = address.route||""
          @fromCity = address.locality||""
          @fromAddress = @fromStreet+" "+@fromHouse+","+@fromCity
          #da ['map-bridge','async-capsule'], "Set from address by loc:"+@, @fromAddress
          collecion.update({_id: self._id}, {$set: {fromAddress: @fromAddress, fromHouse: @fromHouse, fromStreet: @fromStreet, fromCity: @fromCity}})
        else
          e "Fetching fromAddress error"+err

    if not @path
      da ['async-capsule'], "TripCapsule fetch missing path:"+@
      mapComponent.getTripPath @, (error, path) =>
        if not error
          da ['async-capsule'], "Saving path:"+@, path
          self.path = path
          @_deps['path'].changed()
          collecion.update({_id: self._id}, {$set: {path: path}})
          cb && cb self
        else
          cb error
    else
      #da ['map-bridge', 'long-trips'], "Path is present:"+@path
      cb && cb self

  toString: ->
    "Trip("+@_id+"->#{@oid}) "+@fromAddress+" "+@fromStreet+" "+@fromHouse+","+@fromCity+" "+@fromLoc+"=>"+@fromLatLng+"-toAddress:"+@toAddress+" "+@toStreet+" "+@toHouse+","+@toCity+" "+@toLoc+"=>"+@toLatLng+" "+@time+"-"+@path
    #_(@).chain().clone().omit(['_deps'])
