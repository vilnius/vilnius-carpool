@nextDate = (trip, from = moment())->
  if trip.repeat
    # mon, wen will look [ 1, 2 ] in array
    # it moment.day() is 1, acut
    today = from.day();
    break for weekDay, i in trip.repeat when weekDay >= today
    #d "Break on #{weekDay}, because today #{today}", trip.repeat
    if i == trip.repeat.length
      weekDay = trip.repeat[0]
      nextDay = moment(from).add(1,"week").day(weekDay);
    else
      nextDay = moment(from).day(weekDay);
    # TODO check if this bTime or aTime
    time = moment(trip.bTime);
    # time.set({year:nextDay.year(), dayOfYear: nextDay.dayOfYear();
    time.year(nextDay.year());
    time.dayOfYear(nextDay.dayOfYear());
    trip.bTime = time.toDate();
