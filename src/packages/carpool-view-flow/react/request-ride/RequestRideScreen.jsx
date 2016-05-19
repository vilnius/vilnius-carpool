import React from 'react'
import { createContainer } from 'meteor/react-meteor-data';

import { _ } from 'meteor/underscore';

import GoogleMap from '../components/GoogleMap'
import { config, muiTheme } from '../config'
import RaisedButton from 'material-ui/lib/raised-button';
import wrapScreen from '../layout/wrapScreen'
import RideInfo from '../components/RideInfo'
import { getUserPicture } from '../api/UserPicture.coffee'
import Loader from '../components/Loader'


export default class RequestRide extends React.Component {

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
      console.log("Trip", trip);
      user = Meteor.users.findOne({_id: trip.owner});
      trip.driverName = getUserName(user);
      trip.driverAge = 26;
      trip.driverPicture = getUserPicture(user);

      trip.stops.push({
        title: trip.toAddress
      })

      isRequested = _(trip.requests).findWhere({userId: Meteor.userId()});
      //console.log("Requested trip", isRequested);
      return (
        <div style={{color: config.colors.textColor}}>
          <div style={{
            width: window.innerWidth,
            height: mapHeight,
            marginTop: topBarHeight
          }}>
            <GoogleMap trip={trip} />
          </div>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <RideInfo ride={trip} width={this.props.width} />
            <div style={{
              marginTop: 18,
              textAlign: 'center',
            }}>
              <RaisedButton primary style={{width: window.innerWidth * 0.9, borderRadius: 5}}
                label={isRequested ? "Withdraw request" : "Request ride"}
                onClick={() => {alert('Modal with timechoice coming')}}
              />
            </div>
          </div>
        </div>
      )
    }
  }
}

RequestRide.propTypes = {
  progress: React.PropTypes.object,
  trip: React.PropTypes.object
};

export default RequestRideScreen = createContainer(({tripId}) => {
  const progress = new Progress();
  const trip = carpoolService.pullOneTrip({_id: tripId}, progress.setProgress.bind(progress, 'oneTrip'));
  return {
    progress,
    trip,
  };
}, RequestRide);

RequestRideWrap = wrapScreen(RequestRide, {
  innerScreen: true,
  title: 'Ride offer',
})
