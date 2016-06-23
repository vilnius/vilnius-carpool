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
  api.use('reactive-var','client');

  api.use('kadira:flow-router');
  api.use('kadira:blaze-layout');
  //api.use('arillo:flow-router-helpers', 'client');

  api.use("spastai:flow-controll@0.0.2", ["client", "server"]);
  api.use("dry:forms-frame@0.1.5");
  api.use("dry:forms-field-listedit@0.0.1");

  api.use(['spastai:google-client@0.0.6'], 'client');

  api.addFiles('lib/Security.coffee');
  api.addFiles('server/publishAdmin.coffee', "server");
  api.addFiles('server/admin.coffee', "server");

  api.addFiles('client/i18n/helper.js', "client");
  api.addFiles('client/AdminLogin_i18n.coffee', "client");

  api.addFiles('client/CarpoolAdminClient.coffee', "client");
  // api.addFiles('client/AdminController.coffee', "client");
  api.addFiles(['client/AdminLanding.html', 'client/AdminLanding.coffee'], "client");
  api.addFiles(['client/AdminLogin.html', 'client/AdminLogin.coffee'], "client");
  api.addFiles(['client/StopsAdmin.html', 'client/StopsAdmin.coffee'], "client");
  api.addFiles(['client/FeedbackAdmin.html', 'client/FeedbackAdmin.coffee'], "client");
  api.addFiles(['client/NeldRowsTable.html', 'client/NeldRowsTable.coffee'], "client");
  // api.addFiles(['client/UsersAdmin.html', 'client/UsersAdmin.coffee'], "client");
  // api.addFiles(['client/TripsAdmin.html', 'client/TripsAdmin.coffee'], "client");

  api.addFiles(['client/layout.html', 'client/layout.coffee'], "client");
  api.addFiles(['client/mockNotFound.html'], "client");

  api.addFiles('client/routes.coffee', "client");
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('carpool-admin');
  ///api.addFiles('carpool-admin-tests.js');
});
