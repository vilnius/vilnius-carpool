###
  Begin moving routing.js to coffee
###
@extendQueryEncoded = (query, persistKeys)->
  persistQuery = _.pick(Router.current({reactive: false}).params.query, persistKeys);
  _.extend(persistQuery, query)
  encodeUriQuery(persistQuery)

@extendQueryPlain = (query, persistKeys)->
  persistQuery = _.pick(Router.current({reactive: false}).params.query, persistKeys);
  _.extend(persistQuery, query)
  #da ['add-trip'], "Extending query:", [persistQuery,persistQuery]
  _.map(_.pairs(persistQuery), (queryPart)->
      return queryPart[0] + '=' + queryPart[1];
  ).join('&');

@extendQuery = @extendQueryPlain

@goExtendedQuery = (params, query, persistKeys) ->
  routeName = Router.current({reactive: false}).route.getName();
  #da ['add-trip'], "Extending query for route:", routeName
  Router.go(routeName, params, {query: extendQuery(query, persistKeys)});

Router.map ->
  @route 'Welcome', {path: '/',	controller: 'MapController'};
  @route 'Login', {path: '/login',	controller: 'MapController'};
  @route 'Register', {path: '/register',	controller: 'MapController'};
  @route 'Map', {path: '/trips',	template: "TripAddForm", controller: 'MapController'};
