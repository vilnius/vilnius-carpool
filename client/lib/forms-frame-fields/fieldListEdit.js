/*******************************
 * ListEdit component keeps lsit in memory
 */
Template.feildListedit.created = function() {
	//d("feildListedit created:", this.data);
};

Template.feildListedit.items = function(parent) {
	//d("Parent:",parent)
	return getData(this);
};

Template.feildListedit.events({
	'click .addToList': function (event, template) {
		var item = $(template.find('#'+this.field+'-text')).val();
		addItem(this,item);
		//v("Save item:"+item);
		var list = getData(this);
		if(!list) {
			list = [];
		}
		list.push(item);
		setData(this, list);
		$(template.find('#'+this.field+'-text')).val('');
	},
	'click .listEditItem': function (event, template) {
		//d("Item clicked:"+this+" for:",template.data);
		$(template.find('#'+template.data.field+'-text')).val(this);
	},
	'click .deleteFromList': function (event, template) {
		var item = $(template.find('#'+this.field+'-text')).val();		
		var list = getData(this);
		d("Deleting "+item, _.without(list, item), ['group-editing']);
		setData(this, _.without(list, item));
	}
});

function setData(instance, data) {
	//Session.set('#'+instance.field+'-list',data); 
	instance.setItems && instance.setItems(data);
}

function getData(instance) {
	//d("Getting:"+'#'+instance.field+'-list', instance);
	//return Session.get('#'+instance.field+'-list');
	return instance.getItems && instance.getItems();
}

function addItem(instance, item) {
	instance.addItem && instance.addItem(item);
}
