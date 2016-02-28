Handlebars.registerHelper 'combine', (context, options) ->
  #d("All:", _(options.hash).extend(context));
  _(options.hash).extend
    getTime: ->
      context?.getTime()
    setTime: (value) ->
      context?.setTime value
      return
