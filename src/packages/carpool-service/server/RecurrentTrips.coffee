@nextDate = (trip, from = moment())->
  if trip.repeat
    # mon, wen will look [ 1, 2 ] in array
    # it moment.day() is 1, acut
    today = from.day();
    break for weekDay in trip.repeat when weekDay >= today
    #d "Break on #{weekDay}, because today #{today}", trip.repeat
    # TODO check if this bTime or aTime
    nextDay = moment().day(weekDay);
    time = moment(trip.bTime);
    # time.set({year:nextDay.year(), dayOfYear: nextDay.dayOfYear();
    time.year(nextDay.year());
    time.dayOfYear(nextDay.dayOfYear());
    trip.bTime = time.toDate();
