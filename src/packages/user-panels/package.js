Package.describe({
    summary: "Smart panels to organize user interface",
});


Package.on_use(function (api) {
    if (api.export) api.export(['Panels', 'panelManager'], 'client');

	api.use(["underscore", "handlebars", "templating", "less"], "client");
	
    api.add_files(['model.js'] , ['server', 'client']);
    api.add_files(['publish.js'] , 'server');
    api.add_files(['abstractPanel.html','abstractBorderlessPanel.html'] , 'client');
    api.add_files(['panel.js','abstractPanel.css',
                   'abstractPanel.js', 
                   'abstractBorderlessPanel.js', 
                   "subscribtions.js"] , 'client');
});

