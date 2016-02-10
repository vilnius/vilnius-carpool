Package.describe({
  name: 'carpool-admin',
  summary: ' /* Fill me in! */ ',
  version: '1.0.0',
  git: ' /* Fill me in! */ '
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use(['underscore', 'coffeescript'], ['server', 'client']);
  api.use('templating','client');
  api.use('iron:router','client');
  api.addFiles('lib/Security.coffee');
  api.addFiles('server/publishAdmin.coffee', "server");
  api.addFiles('client/AdminController.coffee', "client");
  api.addFiles(['client/AdminLanding.html', 'client/AdminLanding.coffee'], "client");
  api.addFiles('client/routes.coffee', "client");
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('carpool-admin');
  ///api.addFiles('carpool-admin-tests.js');
});
