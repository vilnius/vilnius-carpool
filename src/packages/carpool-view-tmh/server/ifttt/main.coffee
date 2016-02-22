worker = new IftttWorker();

Router.map ()->
  @route 'Ifttt', {
    where: 'server',
    path: '/ifttt',
    action: ()->
      request = this.request.method;
      #da ['ifttt-router'], "Ifttt called:", @request.body
      worker.sendFavoritesEmail @request.body.sender, @request.body['body-plain']
      
      @response.writeHead(200, {'Content-Type': 'text/html'});
      @response.end('<html><body>Your request was a ' + request + '</body></html>');
  }

  ###
   Add trip is done on server as quickly add trip (not loading all scripts)
   Security issue: userid is exposed - the actions should be done through pulbic actionId 
  ###
  @route 'addTrip', {
    where: 'server',
    path: '/addTrip',
    action: ()->
      request = this.request.method;
      da ['ifttt-router'], "Add trip:", @params.tripLocs
      tripId = worker.addTrip @params.tripLocs, @params.id  
      # Should go to page with selected new trip
      url =  Meteor.absoluteUrl("");
      @response.writeHead(302, {'Content-Type': 'text/html', location: url});
      @response.end('');
  }
