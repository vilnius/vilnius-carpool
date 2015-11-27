parser = new TextParser();
graph = new FacebookGraph();

Meteor.publish("facebookFeed", function (niceLink, filter) {
  	var self = this;
  	var lastRecord = FacebookMessages.findOne({},{sort:{postTime: -1}});
  	var lastPostTime = lastRecord ? new Date(lastRecord.postTime) : new Date(0); 
  	//d("Check the last post time in db:"+lastPostTime,lastRecord);
  	var now = new Date();
  	if(!lastRecord || now-1000*60*60*24 > lastPostTime.getTime()) {
  	  	var user = Meteor.users.findOne(this.userId);
  	  	//d("Fetching records for:"+this.userId, user);
  		if (user.services.facebook.accessToken) {
  			var response = graph.get(user.services.facebook.accessToken, '/tranzuok/feed');
  			//d("Got facebook response:", response);
  			var result = [];
  			var data = response.data;
  			for (i in data) {
  				var entry = data[i];
  				d(":", entry);
  				
  				var item = _.extend({
  					id : entry.id,
  					author : entry.from.name,
  					message : entry.message,
  					owner : entry.from.id,
  					postTime: new Date(entry.updated_time), 
  					link: _(entry.actions).findWhere({name:"Comment"}).link,
  					time: new Date(entry.updated_time) // TODO should be parsed
  				}, parser.parse(entry.message));
  				//self.added("long-trips", entry.id, item);
  				FacebookMessages.update({id:item.id}, item, {upsert:true});
  			}
  			//Meteor.setInterval(function() {
  			//}, 1000 * 60 * 60);
  	    }
  	}
  	filteredTrips = getTripIdsFilteredByLoc(FacebookMessages, filter);
  	da(['long-trips'], "Filter long trips:"+filteredTrips.length, filter);
	var query = {}
	if(filter && (filter.fromLoc || filter.toLoc)) {
		_.extend(query, {_id : {$in: filteredTrips}});
	}
	return FacebookMessages.find(query);
});


