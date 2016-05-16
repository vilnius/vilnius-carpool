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

export default RideOffers = createContainer(({filterOwn = "all", role = "driver"}) => {
  const progress = new Progress();
  if("your" == filterOwn) {
    trips = carpoolService.pullOwnTrips({role:role}, progress.setProgress.bind(progress, 'ownTrips'));
    if(100 == progress.getProgress()) { console.log(`Own ${role} trips:`, trips);}
  } else {
    trips = carpoolService.pullActiveTrips({role:role}, progress.setProgress.bind(progress, 'activeTrips'));
    if(100 == progress.getProgress()) { console.log(`All ${role} trips:`, trips);}
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
