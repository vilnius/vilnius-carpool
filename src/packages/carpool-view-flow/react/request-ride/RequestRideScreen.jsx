import React from 'react'
import { createContainer } from 'meteor/react-meteor-data';

import GoogleMap from '../components/GoogleMap'
import { config, muiTheme } from '../config'
import RaisedButton from 'material-ui/lib/raised-button';
import wrapScreen from '../layout/wrapScreen'
import RideInfo from '../components/RideInfo'

export default class RequestRide extends React.Component {

  render () {
    const topBarHeight = 45
    const mapHeight = 375
    const {progress, trip } = this.props;

    if (100 != progress.getProgress()) {
      return (
        <section style={{height: "100%"}}>
          Loading...
        </section>
      );
    } else {
      //console.log("Trip", trip);
      trip.driverName = 'Vytautė';
      trip.driverAge = 26;
      trip.driverPicture = 'http://lorempixel.com/200/200/people/9';
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
                label="Request ride"
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
