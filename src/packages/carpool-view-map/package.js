Package.describe({
  name: 'carpool-view-map',
  summary: ' /* Fill me in! */ ',
  version: '0.0.1',
  git: ' /* Fill me in! */ '
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use(['underscore', 'coffeescript'], ['server', 'client']);
  //api.use(["less@1.0.11"], 'client');
  api.use(['templating', 'tracker'], 'client');

  api.use('iron:router','client');

  api.use("spastai:flow-controll@0.0.2", ["client", "server"]);
  api.use(['spastai:google-client@0.0.11'], 'client');

  api.addFiles(['i18n/helper.js', 'CarpoolMap_i18n.coffee'], "client");
  api.addFiles(['mapLayout.html'], "client");
  //api.addFiles(['Map.less'], "client");
  api.addFiles(['profilePanel.html', 'profilePanel.coffee'], "client");
  api.addFiles(['CarpoolLogin.html', 'CarpoolLogin.coffee'], "client");
  api.addFiles(['CarpoolMap.html', 'CarpoolMap.coffee'], "client");
  api.addFiles(['MapView.html', 'MapView.coffee'], "client");
  api.addFiles('Controller.coffee', "client");
  api.addFiles('routes.coffee', "client");

});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('carpool-view-map');
});
