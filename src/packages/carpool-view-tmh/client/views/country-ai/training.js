/**
 * 
 */
var wordMatchParser = new WordMatchParser(); 

TrainController = RouteController.extend({
	 waitOn: function() {
    	Meteor.subscribe("facebookFeed");
    },	 
	data: function() {
		var rows = [];
		var messages = FacebookMessages.find();
		messages.forEach(function(item){
			var text = item.message;
			var words = text.toLowerCase().split(/[\s-.,\(\)\?\!><]+/);
			//d("Words:"+text,words)
			var row = {
				_id: item._id,
				message: text,
				words: words,
				results: []
			};
			var matched = wordMatchParser.parse(text,words);
			row.guesses = matched.guesses;
			row.results.push(matched.result);
			//d("Row parsed:", row);
			rows.push(row);
		});
		return {
			 rows: rows,
			 perceptron: Meanings.find()
		 }
	 }
 });
 
 Template.Train. possibilities = function() {
	var parent = this;
	return {
		field: 'result-'+parent._id, 
		getItems: function() {
			return ['today','tomorrow'];
		}, 
		setItems: function(items) {
		}, 
		addItem: function(item) {
		}
	}
};

Template.Train.events({
	'click .learn': function (event, template) {
		d("Learning:", $('#result-'+this._id).val());
		var meaning = 'time';
		var value = $('#result-'+this._id).val();
		if(!value && (value && (value.length == 0))) {
			d("Nothing to learn");
			return;
		}
		var words = this.words;
		var p = Meanings.findOne({meaning:meaning, value:value[0]});
		//d("Meaning found:"+meaning+" "+value[0],p);
		if(!p) {
			var samples = _.map(words, function(value, key) {return {word: value, w:1}});
			d("Inserting samples:",samples);
			Meanings.insert({meaning:meaning, value: value[0], samples: samples});
		} else {
			var newWords = [];
			for(i in words) {
				var unknownWord = true;
				for(j in p.samples) {
					if (p.samples[j].word == words[i]) {
						//d("Known word:"+j+"/"+i, words[i]);
						p.samples[j].w++;
						unknownWord = false;
						break;
					} 
				}
				if(unknownWord){
					//d("New word:"+j+"/"+i,words[i]);
					newWords.push(words[i]);
				}				
			}
			var samples = _.map(newWords, function(value, key) {return {word: value, w:1}});
			var split = _.groupBy(p.samples, function(item) { return item.w > 1 ? 1 : 0;});
			var result = _.sortBy(split[1].concat(samples).concat(split[0]), function(item) { 
				return 1/item.w; 
			}).slice(0,25);
			
			var max = result[0].w;
			_.each(result, function(value, index, list) {
				result[index].n = value.w / max; 
			});
			
			d("Learn only if there are new words:", result);
			if(newWords.length > 0) {
				Meanings.update(p._id, {$set:{samples: result}});
			}
		}
	}
});