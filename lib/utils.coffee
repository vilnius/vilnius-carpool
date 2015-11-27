@findDistinct = (collection, select, field, length = 5, bufferSize = 100) -> 
	offset = 0;
	result = [];		
	while result.length < length
		found = collection.find(select, {limit:bufferSize, skip:bufferSize*offset }).map (item) ->
			item[field];
		if found.length == 0
			break;
		result = _.uniq(result.concat(found));
		offset++;		
	return result.slice(0, length)
	
@mock = (txt) ->
  console.log("Mock #{txt}")
  
class @MockClass

  constructor: (source) ->
    console.log("Mock constructor #{source}")