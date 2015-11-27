Template.BorderlessPanel.rendered = function() {
	d("BorderlessPanel.rendered");
};

Template.BorderlessPanel.isHidden = function() {
	var panel = Panels.findOne({id: this.id});
	//d("Is hidden:"+this.id, panel);
	var sessionVar = Session.get("panel-"+this.id+"-hidden");
	if(_.isBoolean(sessionVar) && sessionVar || (panel && panel.hidden) || (!panel && this.defaultHidden)) {
		return "display: none;";
	} 
};

Template.BorderlessPanel.events({
	'click .close' : function(event, template) {
		d("Closing:", this);
		panelManager.closePanel(this.name, true);
	}
});
 