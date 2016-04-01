Package.describe({
  name: 'carpool-view-mui',
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
  api.versionsFrom('1.3');
  api.use('ecmascript');
  api.use(['underscore', 'coffeescript']);

  api.use(['templating', 'tracker'], 'client');
  api.use('react');
  api.use('react-template-helper');
  api.use('iron:router','client');

  api.use("spastai:carpool-service");
  api.use("carpool-notifications");

  api.addFiles('components/trip-form/TripForm.jsx', "client");

  api.addFiles(['views/MuiLanding.html', 'views/MuiLanding.coffee'], "client");
  api.addFiles(['views/MuiEditTrip.html', 'views/MuiEditTrip.coffee'], "client");

  api.mainModule('routes.coffee', "client");
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('carpool-view-mui');
  api.mainModule('tests/carpool-view-mui-tests.js');
});
