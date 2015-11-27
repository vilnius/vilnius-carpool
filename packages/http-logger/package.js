Package.describe({
    summary: "Post log messages through http",
});

Package.on_use(function (api) {
	api.use(["underscore"], "client");
	api.use(["iron:router"], "server");
  api.add_files('logger.js', 'client');
  api.add_files('server.js', 'server');
  if (api.export) api.export(['HttpLogger'], 'client');
});
