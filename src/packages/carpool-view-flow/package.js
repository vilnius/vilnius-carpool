/*global Package*/

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
  api.use('momentjs:moment','client');

  api.use(['accounts-google', 'accounts-facebook']);
  api.use('kadira:flow-router');

  api.use("spastai:carpool-service");
  api.use("spastai:google-client@0.0.12", 'client');
  api.use('spastai:logw@0.0.4')
  api.use("carpool-i18n");
  api.use("carpool-view");
  api.use("carpool-chat");


  api.addFiles([
    "i18n/en.i18n.js",
    "i18n/lt.i18n.js"
  ], ["client", "server"]);

  api.addFiles('controller.coffee', 'client');
  api.addFiles('layout.jsx', 'client');
  api.mainModule('router.js', 'client');
  api.addFiles('styles.css', 'client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('carpool-view-flow');
  //api.mainModule('carpool-view-flow-tests.js');
});
