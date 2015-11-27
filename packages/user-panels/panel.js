Handlebars.registerHelper("panel", function(arg, options) {
	var panelTemplate = arg.hash.template ||'AbstractPanel'
	//d("Panel:"+panelTemplate,arguments)
	var panel = Panels.findOne({name: arg.hash.id});
	if(panel && panel.closed) {
		return;
	}
	//d("Panel:",panel);
	var contents = options.fn(this);
	var params = _.extend(arg.hash, {
		content : contents
	});

	//return Template[panelTemplate](params);
});

Handlebars.registerHelper("params", function(options) {
	// d("Params:",arguments)
	return options;
});


var Panel = function() {
};

Panel.prototype.closePanel = function (id, closed) {
	var panel = Panels.findOne({
		id: id
	});
	if (panel) {
		Panels.update({
			_id : panel._id
		}, {
			closed : closed
		});
	} else {
		d("Inserting:",id);
		Panels.insert({
			id : id,
			closed : closed
		});
	}
};

Panel.prototype.showPanelForSession = function (id, visible) {
	Session.set("panel-"+id+"-hidden", !visible);
}

Panel.prototype.showPanel = function (id, visible) {
	d("Showing panel:"+id,visible);
	var panel = Panels.findOne({
		id : id
	});
	if (panel) {
		d("Update:",id);
		Panels.update({
			_id : panel._id
		}, {
			hidden : !visible
		});
	} else {
		d("Inserting:",id);
		Panels.insert({
			id : id,
			hidden : !visible
		});
	}
};

//console.log("Creating panel");
panelManager = new Panel();
