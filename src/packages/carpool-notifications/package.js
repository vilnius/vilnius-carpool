Package.describe({
  name: 'carpool-notifications',
  summary: ' /* Fill me in! */ ',
  version: '1.0.0',
  git: ' /* Fill me in! */ '
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use('react');
  api.use('react-template-helper');

  api.addFiles('app-react.jsx', "client");
  api.addFiles('Task.jsx', "client");
  api.addFiles('NotificationPanel.jsx', "client");
  api.export(['NotificationPanel'], 'client');

});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('carpool-notifications');
  //api.addFiles('carpool-notifications-tests.js');
});
