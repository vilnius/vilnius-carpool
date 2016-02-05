/**
 * 
 * Get meaning and value from collection {meaning: 'time', value: 'today', samples: [{word:'snd',w:2},{word: 'siandien',w:1}]} 
 */

WordMatchParser = function () {
};

WordMatchParser.prototype.parse = function(text, words) {
	// {samples: {$elemMatch: {word:'siandien'}}}			
	var guesses = [];
	for(i in words) {
		//d("Checking word:",words[i]);
		var guess = Meanings.findOne({samples: {$elemMatch: {word:words[i]}}});
		if(guess) {
			//d("Guess found "+words[i], guess);
			var sample = _.findWhere(guess.samples,{word: words[i]});
			//d("Sample found "+words[i], sample);
			guesses.push({
				word: words[i],
				guess: sample,
				meaning: guess.meaning,
				value: guess.value
			});
		} else {
			guesses.push({
				word: words[i],
			});
		}
	}
	var mostLikely = _.sortBy(guesses, function(item) {
		return (item.guess && -item.guess.n) || 0; 
	});
	//d("Select weighties guess:", mostLikely); 
	
	return {
		guesses: guesses,
		result: mostLikely[0]
	};
};
