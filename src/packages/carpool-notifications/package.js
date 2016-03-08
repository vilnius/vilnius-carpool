Package.describe({
  name: 'carpool-notifications',
  summary: ' /* Fill me in! */ ',
  version: '0.0.1',
  git: ' /* Fill me in! */ '
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use(["mongo", "minimongo"]);
  api.use('react');
  api.use('react-template-helper');
  api.use(['underscore', 'coffeescript']);

  api.use('raix:push@3.0.2')

  api.use('spastai:logw@0.0.4')

  api.addFiles('server/publish.coffee', "server");
  api.addFiles('server/NotificationService.coffee', "server");

  api.addFiles('lib/model.coffee');

  api.addFiles('client/NotificationClient.coffee', "client");

  api.addFiles('client/app-react.jsx', "client");
  api.addFiles('client/Notification.jsx', "client");
  api.addFiles('client/NotificationPanel.jsx', "client");

  api.export(['NotificationPanel'], 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('carpool-notifications');
  //api.addFiles('carpool-notifications-tests.js');
});
