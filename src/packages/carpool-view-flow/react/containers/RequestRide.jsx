import { createContainer } from 'meteor/react-meteor-data';
import { ReactiveVar } from 'meteor/reactive-var'
import { _ } from 'meteor/underscore';

import RequestRideScreen from '../screens/RequestRide.jsx'

/*global Progress*/
/*global carpoolService*/
/*global itineraryFactory*/
/*global Meteor*/
/*global Trips*/

export default createContainer(({tripId, rideId}) => {
  const progress = new Progress();
  const drive = carpoolService.pullOneTrip({_id: tripId}, progress.setProgress.bind(progress, 'oneTrip'));
  const ride = rideId ? carpoolService.pullOneTrip({_id: rideId}, progress.setProgress.bind(progress, 'ride')) : null;
  const stops = carpoolService.pullStops(progress.setProgress.bind(progress, 'stops'));
  const user = drive && Meteor.users.findOne({_id: drive.owner});
  const isRequested = drive && _(drive.requests).findWhere({userId: Meteor.userId()});
  const driveId = drive._id;

  const itinerary = carpoolService.pullRiderItinerary(ride, drive);

  return {
    progress,
    stops,
    user,
    itinerary,
    isRequested,
    driveId,
  };
}, RequestRideScreen);
