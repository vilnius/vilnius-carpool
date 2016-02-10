Template.fieldDatePick.rendered = function() {
	//d("feildDatePick", this.data, ['trip-edit'])
	//var now = new Date();

	/*
	$('#trip-date').datepicker({
	//$('#'+this.data.field).datepicker({
		format: 'yyyy-mm-dd'
	}).on('changeDate', function(ev){
		//console.log(ev.date.valueOf());
		$('#'+this.data.field).datepicker('hide');
	});
	*/
	//$('#trip-date').datepicker('setValue', now);
}

Template.fieldDatePick.helpers({
	value: function() {
		if(this.getTime) {
			return this.getTime()
		} else if(this.value) {
			return this.value
		} else {
			return new Date();
		}
	}
});
