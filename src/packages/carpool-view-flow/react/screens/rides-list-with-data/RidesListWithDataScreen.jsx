import { createContainer } from 'meteor/react-meteor-data';
import RidesList from '../../components/rides-list/RidesList';

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
  //d("RideOffersList query", bTime);
  // Some magic here to remove undefined values
  Object.keys(query).forEach((key)=>{ query[key] || delete query[key] });

  //console.log("Filter query:", query, aLoc)
  if("your" == filterOwn) {
    trips = carpoolService.pullOwnTrips(query, progress.setProgress.bind(progress, 'ownTrips'));
    if(100 == progress.getProgress()) {
       //d(`Own ${role} trips:`, trips);
    }
  } else {
    trips = carpoolService.pullActiveTrips(query, progress.setProgress.bind(progress, 'activeTrips'));
    if(100 == progress.getProgress()) {
      //d(`All ${role} trips:`, trips);
    }
  }

  return {
    progress,
    trips
  };
}, RidesList);
