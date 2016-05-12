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

export default RideOffers = createContainer(() => {
  const progress = new Progress();
  if(true) {
    trips = carpoolService.pullActiveTrips({}, progress.setProgress.bind(progress, 'activeTrips'));
  } else {
    trips = carpoolService.pullOwnTrips({}, progress.setProgress.bind(progress, 'ownTrips'));
  }

  console.log("Active trips:", trips);
  return {
    progress,
    trips
  };
}, RidesList);

RideOffersScreen = wrapScreen(RideOffers, {
  newRideButton: true,
  title: 'Ride Offers',
})
