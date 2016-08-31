@nextDate = (trip, from = moment())->
  if trip.repeat
    # mon, wen will look [ 0, 2] in array
    d "Checking from", from.toDate();
    today = from.isoWeekday()-1;
    break for weekDay, i in trip.repeat when weekDay >= today
    d "Break on #{weekDay}, because today #{today}", trip.repeat
    if i == trip.repeat.length
      weekDay = trip.repeat[0]
      nextDay = moment(from).add(1,"week").isoWeekday(weekDay+1);
    else
      nextDay = moment(from).isoWeekday(weekDay+1);
    # TODO check if this bTime or aTime
    #console.log("bTime", trip.bTime);
    time = moment(trip.bTime);
    # time.set({year:nextDay.year(), dayOfYear: nextDay.dayOfYear();
    time.year(nextDay.year());
    time.dayOfYear(nextDay.dayOfYear());
    trip.bTime = time.toDate();
