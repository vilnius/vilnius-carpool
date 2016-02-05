# Worker is like business logic 
class @IftttWorker
  constructor: (source) ->
    @

  sendFavoritesEmail: (sender, content) ->
    reUrl = /(http|ftp|https):\/\/([\w\-_]+(?:(?:\.[\w\-_]+)+))([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/
    matchUrl = content.match(reUrl)
    if(matchUrl.length == 0) 
      d "Wrong post to sendFavoritesEmail"
      return
    url = matchUrl[0]
    #d "Url found:", url
    result = Meteor._wrapAsync(HTTP.call)("GET", url, {followRedirects: false})
    reLl = /ll=([-+]?[0-9]*\.[0-9]+|[0-9]+),([-+]?[0-9]*\.[0-9]+|[0-9]+)/
    coordinates = result.headers.location.match(reLl)
    fromLoc = [coordinates[2], coordinates[1]] 
    #d "Coordinates got:",fromLoc
    
    user = Meteor.users.findOne({$or:[{'emails.address':sender},{'services.facebook.email':sender}]});
    #d "User fetch favorite trips:"+sender, user
    favoriteTrips = @_findFavoriteTrips user._id, fromLoc
    d "Favorite trips:", favoriteTrips
    emailText = "Select where do you go:"
    emailHtml = "<b>Select where do you go:</b>"
    for trip in favoriteTrips
      toAddress = trip.toAddress
      tripLocs = createEncodings([fromLoc, trip.toLoc]);
      url = Meteor.absoluteUrl('addTrip?tripLocs='+tripLocs+'&id='+user._id)
      #d "Favorite to address:", toAddress
      emailText = emailText+'\n'+"Drive to "+toAddress+': '+url
      emailHtml = emailHtml+'<br/>'+ "Drive to <a href='#{url}'>#{toAddress}</a>"
    Email.send({
      from: sender,
      to: sender,
      subject: "Inform others about you trip",
      text: emailText,
      html: emailHtml 
    });       
           
  _findFavoriteTrips: (userId, fromLoc) ->
    result = {}
    trips = Trips.find({owner: userId }) 
    trips.forEach (item)->
      index = item.toHouse+item.toStreet+item.toCity;
      #d("Indexing favorite trip:", index, ['favorite-trips']);
      if result[index] 
        #Maybe toLoc is still missing
        if(!result[index].toLoc) 
          result[index].toLoc = item.toLoc;
        result[index].frequency++;
      else 
        #d("Overwrite fromXxxx with current location"+trip);
        result[index] = _.extend(item, {fromLoc: fromLoc})
        result[index].frequency = 0;
     
      #d("Unique for "+index,result[index]);
      
    #d("Favorites result:",result,['favorite-trips']);
    _.values(_.sortBy(result, (item) ->
      return -item.frequency;
    )).slice(0,3);
        
  addTrip: (tripLocs, userId) ->  
    locs = decode(tripLocs)
    trip = 
      fromLoc: locs[0]
      toLoc: locs[1]
      owner: userId
      requests: [] 
      time: new Date()
      role : "driver"
    tripId = Trips.insert(trip);
    da(['INFO','viewport-map'], "Added trip:"+tripId, trip);
      
    