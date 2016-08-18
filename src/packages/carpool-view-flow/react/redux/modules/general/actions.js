import * as constants from './constants';

export function updateFromLocation (newFromLocation) {
  return {
    type: constants.LOCATION_FROM_UPDATED,
    payload: newFromLocation,
  }
}

export function updateToLocation (newToLocation) {
  return {
    type: constants.LOCATION_TO_UPDATED,
    payload: newToLocation,
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
