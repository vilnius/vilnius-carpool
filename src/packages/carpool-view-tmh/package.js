Package.describe({
  name: 'carpool-view-tmh',
  summary: ' /* Fill me in! */ ',
  version: '1.0.0',
  git: ' /* Fill me in! */ '
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.addFiles('carpool-view-tmh.js');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('carpool-view-tmh');
  api.addFiles('carpool-view-tmh-tests.js');
});
