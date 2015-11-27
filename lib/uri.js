encodeUriQuery = function (query) {
	return _.map(_.pairs(query), function (queryPart) {
	    return queryPart[0] + '=' + encodeURIComponent(queryPart[1]);
	}).join('&');	
}
