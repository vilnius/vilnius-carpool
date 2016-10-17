import { createContainer } from 'meteor/react-meteor-data';
import RidesList from '../components/rides-list/RidesList';

/*global Progress*/
/*global carpoolService*/

export default createContainer(({filterOwn = "all", role = "driver", aLoc, bLoc, bTime}) => {
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
}, RidesList);
