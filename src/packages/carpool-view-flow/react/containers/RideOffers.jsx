import { connect } from 'react-redux';
import { createContainer } from 'meteor/react-meteor-data';

import locationFromSelector from '../redux/selectors/locationFrom.js';
import locationToSelector from '../redux/selectors/locationTo.js';
import tripDateTimeSelector from '../redux/selectors/tripDateTime.js';
import RideOffersScreen from '../screens/RideOffers.jsx'

/*global Progress*/
/*global carpoolService*/

const RideOffersContainer = createContainer(({filterOwn = "all", role = "driver", aLoc, bLoc, bTime}) => {
  const progress = new Progress();
  const query = {
    role: role,
    fromLoc: aLoc,
    toLoc: bLoc,
    bTime: bTime && bTime.toDate()
  }
  let trips

  // Some magic here to remove undefined values
  Object.keys(query).forEach((key)=>{ query[key] || delete query[key] });

  if("your" == filterOwn) {
    trips = carpoolService.pullOwnTrips(query, progress.setProgress.bind(progress, 'ownTrips'));
  } else {
    trips = carpoolService.pullActiveTrips(query, progress.setProgress.bind(progress, 'activeTrips'));
  }

  return {
    progress,
    trips
  };
}, RideOffersScreen);

const connectedRideOffersScreen = connect((state) => ({
  locationFrom: locationFromSelector(state),
  locationTo: locationToSelector(state),
  tripDateTime: tripDateTimeSelector(state),
}))(RideOffersContainer)

export default connectedRideOffersScreen
