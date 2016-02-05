// replaces {..} with values in array
String.prototype.format = function(args, index) {
  return this.replace(/{(\w+)}/g, function(match, number) {
    return typeof args[index[number]] != 'undefined'
      ? args[index[number]]
      : match
    ;
  });
};
