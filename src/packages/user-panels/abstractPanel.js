Template.AbstractPanel.events({
	'click .close' : function(event, template) {
		d("Closing:", this);
		panelManager.closePanel(this.name, true);
	}
});
