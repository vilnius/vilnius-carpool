let pathFor = ( path, params ) => {
  let query = params && params.query ? FlowRouter._qs.parse( params.query ) : {};
  return FlowRouter.path( path, params, query );
};

let urlFor = ( path, params ) => {
  return Meteor.absoluteUrl( pathFor( path, params ) );
};

let currentRoute = ( route ) => {
  FlowRouter.watchPathChange();
  return FlowRouter.current().route.name === route ? 'active' : '';
};

let extendPath = (params) => {
  return pathFor(FlowRouter.current().route.name, params);
}

let goExtendedPath = (params) => {
  return FlowRouter.go(FlowRouter.current().route.name, params);
}

let goExtendedQuery = (path, addedParams, addedQuery) => {
  let {params, queryParams} = FlowRouter.current()
  console.log("Query", queryParams, "adding", addedQuery);
  return FlowRouter.go(path, _(params).extend(addedParams), _(queryParams).extend(addedQuery));
}


export const FlowHelpers = {
  pathFor: pathFor,
  urlFor: urlFor,
  currentRoute: currentRoute,
  extendPath: extendPath,
  goExtendedPath: goExtendedPath,
  goExtendedQuery: goExtendedQuery
};
