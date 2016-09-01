import { createContainer } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';

import YourDriveScreen from '../screens/YourDrive.jsx'

/*global Meteor*/
/*global carpoolService*/
/*global Progress*/

export default createContainer(({tripId}) => {
  const progress = new Progress();
  const drive = carpoolService.pullOneTrip({_id: tripId}, progress.setProgress.bind(progress, 'oneTrip'));
  const stops = carpoolService.pullStops(progress.setProgress.bind(progress, 'stops'));
  const user = drive && Meteor.users.findOne({_id: drive.owner});

  const itinerary = carpoolService.pullDriverItinerary(drive);
  const isRequested = drive && _(drive.requests).findWhere({userId: Meteor.userId()});

  return {
    progress,
    stops,
    user,
    itinerary,
    isRequested
  };
}, YourDriveScreen);
