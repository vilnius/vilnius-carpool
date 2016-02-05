/**
 * 
 */
Future = Npm.require('fibers/future');
var graph = Npm.require('fbgraph');


FacebookGraph = function () {
};

FacebookGraph.prototype.get = function (accessToken, url, callback) {
    graph.setAccessToken(accessToken);
    var syncCall = Meteor._wrapAsync(graph.get);
    /*
    graph.get(url, function(err,response) {
    	callback(err,response);
    });
    */
    return syncCall(url);
};
