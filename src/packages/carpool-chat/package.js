Package.describe({
  name: 'carpool-chat',
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
  api.use(["mongo", "minimongo"]);

  api.use('react');

  api.use("spastai:carpool-service");

  api.addFiles('model.coffee');
  api.addFiles('publish.coffee', 'server');
  api.mainModule('Chat.jsx', 'client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('carpool-chat');
  //api.mainModule('carpool-chat-tests.js');
});
