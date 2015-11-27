Package.describe({
    summary: "Facebook fbgraph npm module",
});


Package.on_use(function (api) {
	api.use(["underscore"], "server");

    api.add_files('FacebookGraph.js', 'server');
    
    if (api.export) api.export(['FacebookGraph'], 'server');
});

Npm.depends({fbgraph:"0.2.6"});