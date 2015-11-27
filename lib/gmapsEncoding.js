createEncodings = function(coords) {
	var i = 0;
 	var plat = 0;
	var plng = 0;
 	var encoded_points = "";
 	for(i = 0; i < coords.length; ++i) {
	    var lat = coords[i][0];				
		var lng = coords[i][1];		
 		encoded_points += encodePoint(plat, plng, lat, lng);
 	    plat = lat;
	    plng = lng;
	}
	// do not close polyline
	//encoded_points += encodePoint(plat, plng, coords[0][0], coords[0][1]);
	return encoded_points;
}
 
encodePoint = function(plat, plng, lat, lng) {
	var late5 = Math.round(lat * 1e5);
    var plate5 = Math.round(plat * 1e5)    
 
	var lnge5 = Math.round(lng * 1e5);
    var plnge5 = Math.round(plng * 1e5)
 
	dlng = lnge5 - plnge5;
	dlat = late5 - plate5;
 
    return encodeSignedNumber(dlat) + encodeSignedNumber(dlng);
}
 
function encodeSignedNumber(num) {
  var sgn_num = num << 1;
 
  if (num < 0) {
    sgn_num = ~(sgn_num);
  }
 
  return(encodeNumber(sgn_num));
}
 
function encodeNumber(num) {
  var encodeString = "";
 
  while (num >= 0x20) {
    encodeString += (String.fromCharCode((0x20 | (num & 0x1f)) + 63));
    num >>= 5;
  }
 
  encodeString += (String.fromCharCode(num + 63));
  return encodeString;
}


decode = function(encoded){
    // array that holds the points
    var points=[ ]
    var index = 0, len = encoded.length;
    var lat = 0, lng = 0;
    while (index < len) {
      var b, shift = 0, result = 0;
      do {
    	 b = encoded.charAt(index++).charCodeAt(0) - 63;//finds ascii and substract it by 63
              result |= (b & 0x1f) << shift;
              shift += 5;
         } while (b >= 0x20);
       	 var dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
       	 lat += dlat;
       	 shift = 0;
       	 result = 0;
      do {
        b = encoded.charAt(index++).charCodeAt(0) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      var dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
      lng += dlng;
      points.push([( lat / 1E5),( lng / 1E5)])  
    }
  return points
}