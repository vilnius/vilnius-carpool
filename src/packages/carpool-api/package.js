Package.describe({
  name: 'carpool-api',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.use(['underscore', 'coffeescript']);
  api.use('accounts-password');

  api.use('iron:router@1.0.0', "server"); // for fixtures
  api.use('spastai:logw')
  api.use('spastai:carpool-service');

  api.addFiles('security.coffee');
  api.addFiles('carpool-api-authorization.coffee', "server");
  api.addFiles('carpool-api.coffee', "server");
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use(['tinytest', 'test-helpers']);
  api.use(['underscore', 'coffeescript']);
  api.use('accounts-password');
  api.use('http');

  api.use('spastai:logw')
  api.use('carpool-api');
  api.addFiles('carpool-api-tests.coffee', "server");
});
