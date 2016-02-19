Package.describe({
  name: 'carpool-view-map',
  summary: ' /* Fill me in! */ ',
  version: '1.0.0',
  git: ' /* Fill me in! */ '
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use(['underscore', 'coffeescript'], ['server', 'client']);
  api.use(['templating', 'tracker'], 'client');

  api.use('iron:router','client');

  api.use("spastai:flow-controll@0.0.2", ["client", "server"]);
  api.use(['spastai:google-client@0.0.9'], 'client');

  api.addFiles(['mapLayout.html'], "client");
  api.addFiles(['CarpoolLogin.html', 'CarpoolLogin.coffee'], "client");
  api.addFiles(['CarpoolMap.html', 'CarpoolMap.coffee'], "client");
  api.addFiles(['MapView.html', 'MapView.coffee'], "client");
  api.addFiles('routes.coffee', "client");

});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('carpool-view-map');
});
