Package.describe({
  name: 'carpool-admin',
  summary: ' /* Fill me in! */ ',
  version: '1.0.0',
  git: ' /* Fill me in! */ '
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use(['underscore', 'coffeescript'], ['server', 'client']);
  api.addFiles('carpool-admin.js');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('carpool-admin');
  api.addFiles('carpool-admin-tests.js');
});
