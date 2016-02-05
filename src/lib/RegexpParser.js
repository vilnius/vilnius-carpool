var regexps = [{
	//'Vaziuoju 2013-13-21'.match(/(\d{4})-(\d{2})-(\d{2})/);
	meaning: 'time', 
	weight: 1,
	regexp: /(\d{4})-(\d{2})-(\d{2})/,
	value: function(words) {
		return new Date(
			parserInt(words[0]), 
			parserInt(words[1]), 
			parserInt(words[2]) 
		);
	}
}];

RegexpParser = function () {	
};

RegexpParser.prototype.parse = function(text, words) {
	var words = text.match(regexps[0].regexp);
	return {
		meaning: regexps[0].meaning,
		value: regexps[0].value(words)
	}
}