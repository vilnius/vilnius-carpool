import * as constants from './constants';

export function updateFromLocation (newFromLocationString, newFromLocationCoords) {
  return {
    type: constants.LOCATION_FROM_UPDATED,
    payload: {
      locString: newFromLocationString,
      locCoords: newFromLocationCoords,
    },
  }
}

export function updateToLocation (newToLocationString, newToLocationCoords) {
  return {
    type: constants.LOCATION_TO_UPDATED,
    payload: {
      locString: newToLocationString,
      locCoords: newToLocationCoords,
    },
  }
}

export function updateTripDateTime (newDateTime) {
  return {
    type: constants.DATETIME_UPDATED,
    payload: newDateTime,
  }
}

export function detectUserLocation () {
  return (dispatch) => {
    dispatch({
      type: constants.USER_LOCATION_DETECTED,
      payload: null,
    })
  };
}

export function createDrive (cb) {
  return (dispatch, getState) => {
    const state = getState();
    const time = state.general.tripDateTime.toDate();
    let trip = {
      fromAddress: state.general.fullLocationFrom,
      toAddress: state.general.fullLocationTo,
      time,  // TODO move to bTime
      bTime: time,
      role: 'driver',
      fromLoc: state.general.locationFromCoords,
      toLoc: state.general.locationToCoords,
    };

    carpoolService.saveTrip(trip, (error, routedTrip) => {
      if (cb) {
        cb(error, routedTrip);
      }
      flowControllerHelper.goToView('YourDrive', {id: routedTrip._id});
    });
  }
}

export function createRide (cb) {
  return (dispatch, getState) => {
    const state = getState();
    const time = state.general.tripDateTime.toDate();
    let trip = {
      fromAddress: state.general.fullLocationFrom,
      toAddress: state.general.fullLocationTo,
      time,  // TODO move to bTime
      bTime: time,
      role: 'rider',
      fromLoc: state.general.locationFromCoords,
      toLoc: state.general.locationToCoords,
    };

    carpoolService.saveTrip(trip, (error, routedTrip) => {
      if (cb) {
        cb(error, routedTrip);
      }
      flowControllerHelper.goToView('YourRide', {id: routedTrip._id});
    });
  }
}
