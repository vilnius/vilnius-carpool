import React from 'react'
import { createContainer } from 'meteor/react-meteor-data';

import { _ } from 'meteor/underscore';
import {d, da} from 'meteor/spastai:logw'

import GoogleMap from '../components/GoogleMap'
import { config, muiTheme } from '../config'
import RaisedButton from 'material-ui/lib/raised-button';
import Snackbar from 'material-ui/lib/snackbar';
import RideInfo from '../components/RideInfo'
import { getUserPicture } from '../api/UserPicture.coffee'
import Loader from '../components/Loader'


export default class RequestRide extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
        snackbarOpen: false,
        snackbarText: ''
      };
  }

  handleRequestClose() {
    //d("Close snackbar")
    this.setState({
      snackbarOpen: false,
    });
  }

  showSnackbar(message) {
    //d("Showing snack message", message)
    this.setState({
      snackbarText: message,
      snackbarOpen: true
    });
  };

  render () {
    const rideInfoHeight = 215
    const mapHeight = this.props.height - rideInfoHeight
    const {progress, trip, stops} = this.props;

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
        <div style={{color: config.colors.textColor}}>
          <div style={{
            width: this.props.width,
            height: mapHeight,
          }}>
            <GoogleMap trip={trip} stops={stops} />
          </div>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <RideInfo ride={trip} width={this.props.width} />
            <div style={{
              marginTop: 18,
              textAlign: 'center',
            }}>
              { !!isRequested ? (
                <RaisedButton primary style={{width: this.props.width * 0.9, borderRadius: 5}}
                  data-cucumber="withdraw-request" label='Withdraw'
                  secondary onClick={() => {
                    this.showSnackbar("Trip request withdrawn");
                  }} />
              ) : (
                <RaisedButton primary style={{width: this.props.width * 0.9, borderRadius: 5}}
                  data-cucumber="request" label='Request'
                  secondary onClick={() => {
                    carpoolService.requestRide(trip._id);
                    this.showSnackbar("The trip was requested");
                  }} />
              ) }
              <Snackbar
                open={this.state.snackbarOpen}
                message={this.state.snackbarText}
                autoHideDuration={4000}
                onRequestClose={() => this.handleRequestClose()}
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

export default RequestRideContainer = createContainer(({tripId}) => {
  const progress = new Progress();
  const trip = carpoolService.pullOneTrip({_id: tripId}, progress.setProgress.bind(progress, 'oneTrip'));
  const stops = carpoolService.pullStops(progress.setProgress.bind(progress, 'stops'));
  return {
    progress,
    trip,
    stops,
  };
}, RequestRide);
