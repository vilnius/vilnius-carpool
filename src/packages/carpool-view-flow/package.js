Package.describe({
  name: 'carpool-view-flow',
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
  api.use(['underscore', 'coffeescript'], ['server', 'client']);
  //api.use(['templating', 'tracker'], 'client');
  api.use('react');

  api.use('kadira:flow-router');

  //api.addFiles('flowHelpers.js', 'client');
  api.addFiles('controller.coffee', 'client');
  api.addFiles('components.js', 'client');
  api.addFiles('layout.jsx', 'client');
  api.mainModule('router.js');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('carpool-view-flow');
  api.mainModule('carpool-view-flow-tests.js');
});