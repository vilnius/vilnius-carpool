import React from 'react'
import { createContainer } from 'meteor/react-meteor-data';

import wrapScreen from '../layout/wrapScreen'
import RidesList from '../components/RidesList'
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import ContentAdd from 'material-ui/lib/svg-icons/content/add';
import SearchIcon from 'material-ui/lib/svg-icons/action/search';
// import HamburgerMenuButton from './components/HamburgerMenuButton'
import RepeatingDays from '../components/ReccuringDays'
import { config } from '../config'

export default RideOffers = createContainer(({filterOwn = "all", role = "driver", aLoc, bLoc}) => {
  const progress = new Progress();
  // Some magic here to remove undefined values
  query = {
    role: role,
    fromLoc: aLoc,
    toLoc: bLoc
  }
  Object.keys(query).forEach((key)=>{query[key] || delete query[key]});

  console.log("Filter query:", query, aLoc)
  if("your" == filterOwn) {
    trips = carpoolService.pullOwnTrips(query, progress.setProgress.bind(progress, 'ownTrips'));
    //if(100 == progress.getProgress()) { console.log(`Own ${role} trips:`, trips);}
  } else {
    trips = carpoolService.pullActiveTrips(query, progress.setProgress.bind(progress, 'activeTrips'));
    //if(100 == progress.getProgress()) { console.log(`All ${role} trips:`, trips);}
  }

  return {
    progress,
    trips
  };
}, RidesList);

RideOffersScreen = wrapScreen(RideOffers, {
  newRideButton: true,
  title: 'Ride Offers',
})
