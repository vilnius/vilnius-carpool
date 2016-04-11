Package.describe({
  name: 'carpool-geo',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

// https://github.com/apache/cordova-plugin-geolocation.git
Cordova.depends({
  "cordova-plugin-geolocation": "2.1.0"
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');

  //api.use('cordova:cordova-plugin-geolocation@2.1.0');

  api.use(['underscore', 'coffeescript'], ['server', 'client']);

  api.addFiles('carpool-geo.coffee', 'client');

});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('carpool-geo');
});
