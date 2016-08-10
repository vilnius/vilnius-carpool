import React from 'react'
import { createContainer } from 'meteor/react-meteor-data';

import { _ } from 'meteor/underscore';

import GoogleMap from '../../components/map/GoogleMap'
import { config } from '../../config'
import RaisedButton from 'material-ui/lib/raised-button';
import TripInfoWithMap from '../../components/ride-info/TripInfoWithMap.jsx'
import Loader from '../../components/common/Loader'
import { getUserPicture } from '../../api/UserPicture.coffee'
/*global Meteor*/
/*global getUserName*/
/*global carpoolService*/
/*global Progress*/


class YourDrive extends React.Component {

  render () {
    const topBarHeight = 45
    const mapHeight = 375
    const {progress, stops, itinerary, user, isRequested} = this.props;

    if (100 != progress.getProgress()) {
      return (
        <section style={{height: "100%", marginTop: 25}}>
          <Loader />
        </section>
      );
    } else {
      const bottomPartHeight = 65

      return (
        <div data-cucumber="screen-your-drive" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <TripInfoWithMap
            width={this.props.width}
            height={this.props.height - bottomPartHeight}
            itinerary={itinerary}
            user={user}
          />
          <RaisedButton primary style={{width: window.innerWidth * 0.9, borderRadius: 5}}
            label={isRequested ? "Withdraw confirmation" : "Offer ride"}
            onClick={() => { alert('Modal with timechoice coming') }}
          />
        </div>
      )
    }
  }
}

YourDrive.propTypes = {
  progress: React.PropTypes.object,
  stops: React.PropTypes.array,
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
  user: React.PropTypes.object,
  isRequested: React.PropTypes.object,
  itinerary: React.PropTypes.array,
};

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
}, YourDrive);
