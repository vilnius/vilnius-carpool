import { createContainer } from 'meteor/react-meteor-data';

import YourRideScreen from '../screens/YourRide.jsx'

/*global Progress*/
/*global Meteor*/
/*global carpoolService*/

export default createContainer(({rideId}) => {
  const progress = new Progress();
  const ride = rideId ? carpoolService.pullOneTrip({_id: rideId}, progress.setProgress.bind(progress, 'ride')) : null;
  const stops = carpoolService.pullStops(progress.setProgress.bind(progress, 'stops'));
  const user = ride && Meteor.users.findOne({_id: ride.owner});
  const itinerary = carpoolService.pullRiderItinerary(ride);

  return {
    progress,
    stops,
    user,
    itinerary
  };
}, YourRideScreen);
