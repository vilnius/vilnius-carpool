import { createContainer } from 'meteor/react-meteor-data';
import { connect } from 'react-redux'

import locationFromSelector from '../redux/selectors/locationFrom.js';
import locationToSelector from '../redux/selectors/locationTo.js';
import tripDateTimeSelector from '../redux/selectors/tripDateTime.js';
import TripFormScreen from '../screens/TripForm.jsx'

/*global Progress*/

const connectedTripForm = connect((state) => ({
  locationFrom: locationFromSelector(state),
  locationTo: locationToSelector(state),
  tripDateTime: tripDateTimeSelector(state),
}))(TripFormScreen);

export default createContainer(() => {
  const progress = new Progress();
  const stops = carpoolService.pullStops(progress.setProgress.bind(progress, 'stops'));
  return {
    progress,
    stops
  }
}, connectedTripForm);
