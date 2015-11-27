Handlebars.registerHelper('combine', function(context, options) {
  //d("All:", _(options.hash).extend(context));
  return _(options.hash).extend({
	  getTime: function() {
		  return context.getTime();
	  },
	  setTime: function(value) {
		  context.setTime(value);
	  }
  });
});