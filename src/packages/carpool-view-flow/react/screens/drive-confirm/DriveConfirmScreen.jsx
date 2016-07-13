
/*global carpoolService*/
/*global Progress*/
/*global Meteor*/
/*global getUserName*/

import React from 'react'
import { createContainer } from 'meteor/react-meteor-data';

import { _ } from 'meteor/underscore';
import {d} from 'meteor/spastai:logw'

import GoogleMap from '../../components/map/GoogleMap'
import { config } from '../../config'
import RaisedButton from 'material-ui/lib/raised-button';
import Snackbar from 'material-ui/lib/snackbar';
import RideInfo from '../../components/ride-info/RideInfo'
import { getUserPicture } from '../../api/UserPicture.coffee'
import Loader from '../../components/common/Loader'


class DriveConfirm extends React.Component {

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
      snackbarOpen: false
    });
  }

  showSnackbar(message) {
    //d("Showing snack message", message)
    this.setState({
      snackbarText: message,
      snackbarOpen: true
    });
  }

  render () {
    const rideInfoHeight = 215
    const mapHeight = this.props.height - rideInfoHeight
    const {progress, drive, ride, stops, invitationId} = this.props;

    if (100 != progress.getProgress()) {
      return (
        <section style={{height: "100%", marginTop: 25}}>
          <Loader />
        </section>
      );
    } else {
      // da(["request-ride"],"Trip", trip);
      const user = Meteor.users.findOne({_id: drive.owner});
      drive.driverName = getUserName(user);
      drive.driverAge = 26;
      drive.driverPicture = getUserPicture(user);

      const isRequested = _(drive.requests).findWhere({userId: Meteor.userId()});
      //console.log("Requested drive", isRequested);
      return (
        <div data-cucumber="screen-user-ride" style={{color: config.colors.textColor}}>
          <div style={{
            width: this.props.width,
            height: mapHeight,
          }}>
            <GoogleMap trip={drive} stops={stops} ride={ride} />
          </div>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <RideInfo drive={drive} ride={ride} width={this.props.width} />
            <div style={{
              marginTop: 18,
              textAlign: 'center',
            }}>
              {isRequested ? (
                <RaisedButton primary style={{width: this.props.width * 0.9, borderRadius: 5}}
                  data-cucumber="withdraw-confirmation" label="Withdraw"
                  secondary onClick={() => {
                    this.showSnackbar("Trip confirmation withdrawn");
                  }}
                />
              ) : (
                <RaisedButton primary style={{width: this.props.width * 0.9, borderRadius: 5}}
                  data-cucumber="confirm-ride" label="Confirm"
                  secondary onClick={() => {
                    carpoolService.acceptRequest(invitationId, "accept", ()=>d("Acception result", arguments));
                    this.showSnackbar("The drive was confirmed");
                  }}
                />
              )}
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

DriveConfirm.propTypes = {
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
  progress: React.PropTypes.object,
  drive: React.PropTypes.object,
  ride: React.PropTypes.object,
  stops: React.PropTypes.object,
  invitationId: React.PropTypes.number,
};

export default createContainer(({tripId, rideId, invitationId}) => {
  const progress = new Progress();
  const drive = carpoolService.pullOneTrip({_id: tripId}, progress.setProgress.bind(progress, 'oneTrip'));
  const ride = rideId ? carpoolService.pullOneTrip({_id: rideId}, progress.setProgress.bind(progress, 'ride')) : null;
  const stops = carpoolService.pullStops(progress.setProgress.bind(progress, 'stops'));
  return {
    progress,
    drive,
    ride,
    stops,
    invitationId
  };
}, DriveConfirm);
