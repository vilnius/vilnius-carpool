getRandomString = function(possible,length) {
    var text = "";
    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};
