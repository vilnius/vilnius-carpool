import { _ } from 'meteor/underscore';
import { createContainer } from 'meteor/react-meteor-data';

import DriveConfirmScreen from '../screens/DriveConfirm.jsx'

/*global Progress*/
/*global Meteor*/
/*global carpoolService*/

export default createContainer(({tripId, rideId, invitationId}) => {
  const progress = new Progress();
  const drive = carpoolService.pullOneTrip({_id: tripId}, progress.setProgress.bind(progress, 'oneTrip'));
  // const ride = rideId ? carpoolService.pullOneTrip({_id: rideId}, progress.setProgress.bind(progress, 'ride')) : null;
  const stops = carpoolService.pullStops(progress.setProgress.bind(progress, 'stops'));
  const itinerary = carpoolService.pullDriverItinerary(drive);
  const user = drive && Meteor.users.findOne({_id: drive.owner});
  const isRequested = drive && _(drive.requests).findWhere({userId: Meteor.userId()});

  return {
    progress,
    stops,
    user,
    invitationId,
    itinerary,
    isRequested,
  };
}, DriveConfirmScreen);
