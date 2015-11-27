var towns = ['vilnius', 'kaunas', 'šiauliai', "klaipėda", "panevėžys", "plungė", "palanga", "šventoji"];
var time = {
	'5dieni': "Fri",
	'rytoj': "tomorrow",
	'snd': "today"
};
var synonyms = {
	"vilnius":["vln", "vilniaus", "vilniu", "vilnių"],
	"kaunas":['kaunas', "KNS", "kauna", "kauną"],
	"klaipėda":["klaipeda", "klp", 'pajuris',"klaipedą","klaipėdą"],
	"šiauliai":["siauliai"],
	"panevėžys": ['panevezys'],
	"plungė": ["plunge"],
	"šventoji": ['sventoji', 'sventaja'],
	"palanga": ["palangą"], 
	"nida": ["nidos"],
	"Šilalė": ["Šilalės"]
};

var townWords = _.flatten([_.values(synonyms),towns]);
//console.dir(townWords);

TextParser = function () {
	//console.dir(townWords);
};

TextParser.prototype.parse = function(text) {
	//var words = text.toLowerCase().split(/\p/);
	var words = text.toLowerCase().split(/[\s-.,\(\)\?\!><]+/);
	//d("Parsing:"+text,words);
	var foundTowns = _.intersection(words,townWords);
	//d("Towns:",foundTowns);
	
	var result = {
		fromCity: toTitleCase(getCityName(foundTowns[0])),
		toCity: toTitleCase(getCityName(foundTowns[1])),
	}
	// TODO this should be solved in TripCapsule
	result.toAddress = result.toCity;
	result.fromAddress = result.fromCity;
	return result;
};

function getCityName(city) {
	if(synonyms[city]) {
		return city;
	} else {
		for(i in synonyms) {
			var item = synonyms[i];
			if(_.contains(item,city)) {
				return i;
			}
		}
		return city;
	}
}

function toTitleCase(str) {
    return str && str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}