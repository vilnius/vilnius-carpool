import * as constants from './constants';
import moment from 'moment';

const initialState = {
  fullLocationFrom: null,
  fullLocationTo: null,
  locationFrom: null,
  locationTo: null,
  locationFromCoords: null,
  locationToCoords: null,
  tripDateTime: moment().add(15, 'minutes'),
};

// Nukerta adreso gala kuriame raso miesta, valstybe ir t.t.
const extractLocation = (location) => {
  const index = location.indexOf(', Viln');
  if (index > 0) {
    return location.slice(0, index);
  } else {
    return location;
  }
}

export default function generalReducer (state = initialState, action) {
  if (action.type === constants.LOCATION_FROM_UPDATED) {
    return {
      ...state,
      fullLocationFrom: action.payload.locString,
      locationFrom: extractLocation(action.payload.locString),
      locationFromCoords: action.payload.locCoords,
    }
  } else if (action.type === constants.LOCATION_TO_UPDATED) {
    return {
      ...state,
      fullLocationTo: action.payload.locString,
      locationTo: extractLocation(action.payload.locString),
      locationToCoords: action.payload.locCoords,
    }
  } else if (action.type === constants.DATETIME_UPDATED) {
    return {
      ...state,
      tripDateTime: action.payload,
    }
  } else if (action.type === constants.USER_LOCATION_DETECTED) {
    return {
      ...state,
      locationFrom: extractLocation(action.payload),
    }
  }
  return state;
}
