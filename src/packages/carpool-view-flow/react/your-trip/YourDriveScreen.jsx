import React from 'react'
import { createContainer } from 'meteor/react-meteor-data';

import { _ } from 'meteor/underscore';

import GoogleMap from '../components/GoogleMap'
import { config, muiTheme } from '../config'
import RaisedButton from 'material-ui/lib/raised-button';
import wrapScreen from '../layout/wrapScreen'
import RideInfo from '../components/RideInfo'
import Loader from '../components/Loader'
import { getUserPicture } from '../api/UserPicture.coffee'


class YourDrive extends React.Component {

  render () {
    const topBarHeight = 45
    const mapHeight = 375
    const {progress, trip } = this.props;

    if (100 != progress.getProgress()) {
      return (
        <section style={{height: "100%", marginTop: 25}}>
          <Loader />
        </section>
      );
    } else {
      //console.log("Trip", trip);
      user = Meteor.users.findOne({_id: trip.owner});
      trip.driverName = getUserName(user);
      trip.driverAge = 26;
      trip.driverPicture = getUserPicture(user);

      isRequested = _(trip.requests).findWhere({userId: Meteor.userId()});
      //console.log("Requested trip", isRequested);
      return (
        <div data-cucumber="screen-your-drive" style={{color: config.colors.textColor}}>
          <div style={{
            width: window.innerWidth,
            height: mapHeight,
            marginTop: topBarHeight
          }}>
            <GoogleMap trip={trip} />
          </div>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <RideInfo drive={trip} width={this.props.width} />
            <div style={{
              marginTop: 18,
              textAlign: 'center',
            }}>
              <RaisedButton primary style={{width: window.innerWidth * 0.9, borderRadius: 5}}
                label={isRequested ? "Withdraw confirmation" : "Offer ride"}
                onClick={() => {alert('Modal with timechoice coming')}}
              />
            </div>
          </div>
        </div>
      )
    }
  }
}

YourDrive.propTypes = {
  progress: React.PropTypes.object,
  trip: React.PropTypes.object
};

export default YourDriveContainer = createContainer(({tripId}) => {
  const progress = new Progress();
  const trip = carpoolService.pullOneTrip({_id: tripId}, progress.setProgress.bind(progress, 'oneTrip'));
  return {
    progress,
    trip,
  };
}, YourDrive);
