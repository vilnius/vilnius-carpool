/*******************************
 * TimePick 
 */

Template.fieldTimePick.events({
	'click .changeTime': function (event, template) {
		var step = parseInt($(event.currentTarget).attr('delta'));
		var current = this.getTime();
		//d("Decrease time:"+step, current, ['time-pick']);
		this.setTime(new Date(current.getTime() + 1000*60*step));
	},
	'keyup .timeInputText': function(event, template) {
		var timeString = $(event.currentTarget).val();
		var current = this.getTime();
		//da(['viewport-map'], "Time was changed:"+parseTime(current, timeString));
		var time = parseTime(current, timeString);
		time && this.setTime(time);
	}
});

function parseTime(date, time) {
	time = time.length == 4 ? '0'+time:time;
	var tzo = new Date().getTimezoneOffset();
	var sign = tzo >= 0 ? '-' : '+';
	var dateString = date.toISOString().substring(0,10);
	var result = new Date(
			dateString+'T'
			+time
			+sign + pad(tzo / 60) 
	        + pad(tzo % 60));
	return isNaN(result.getTime()) ? null : result;
}

function pad(num) {
    norm = Math.abs(Math.floor(num));
    return (norm < 10 ? '0' : '') + norm;
}