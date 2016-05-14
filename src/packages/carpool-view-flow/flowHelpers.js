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

export const FlowHelpers = {
  pathFor: pathFor,
  urlFor: urlFor,
  currentRoute: currentRoute,
  extendPath: extendPath,
  goExtendedPath: goExtendedPath
};
