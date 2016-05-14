Package.describe({
  name: 'spastai:carpool-service',
  summary: 'Carpool specific package will be used to refactor code',
  version: '0.0.20',
  git: 'git@bitbucket.org:spastai/carpool-service.git'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use(['underscore', 'coffeescript'], ['server', 'client']);
  api.use(["mongo", "minimongo"]);

  api.use("matb33:collection-hooks");

  api.use('spastai:logw@0.0.4')
  api.use("spastai:flow-controll@0.0.2");
  api.use(['spastai:google-client@0.0.10'], 'client');

  api.use('carpool-notifications')

  api.addFiles('lib/model.coffee');

  api.addFiles('server/TripMatcher.coffee', "server");
  api.addFiles('server/server.coffee', "server");
  api.addFiles('server/publish.coffee', "server");

  api.addFiles('client/Progress.coffee');
  api.addFiles('client/CarpoolServiceClient.coffee');
});


Package.onTest(function(api) {
  api.use(['tinytest', 'test-helpers']);
  api.use(['underscore', 'coffeescript']);
  api.use('jquery');
  api.use(['spastai:google-client@0.0.10'], 'client');

  api.use('spastai:carpool-service');
  api.addFiles('tests/CarpoolServiceClientTest.coffee', "client");
});
