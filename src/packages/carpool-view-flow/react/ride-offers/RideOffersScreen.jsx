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
  const activeTrips = carpoolService.pullActiveTrips({}, progress.setProgress.bind(progress, 'activeTrips'));
  const ownTrips = carpoolService.pullOwnTrips({}, progress.setProgress.bind(progress, 'ownTrips'));

  return {
    progress,
    activeTrips,
    ownTrips,
  };
}, RidesList);

RideOffersScreen = wrapScreen(RideOffers, {
  newRideButton: true,
  title: 'Ride Offers',
})
