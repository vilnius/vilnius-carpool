import React from 'react'
import { createContainer } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';
import RaisedButton from 'material-ui/lib/raised-button';
import Snackbar from 'material-ui/lib/snackbar';
import { getUserPicture } from '../api/UserPicture.coffee'
import Loader from '../components/common/Loader'
import RideInfoWithMap from '../components/ride-info/RideInfoWithMap.jsx';

/*global Progress*/
/*global carpoolService*/
/*global getUserName*/
/*global Meteor*/

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
  }

  render () {
    const {progress, drive, ride} = this.props;

    if (progress.getProgress() != 100) {
      return (
        <section style={{height: "100%", marginTop: 25}}>
          <Loader />
        </section>
      );
    } else {
      //console.log("Trip", trip);
      const user = Meteor.users.findOne({_id: drive.owner});
      drive.driverName = getUserName(user);
      drive.driverAge = 26;
      drive.driverPicture = getUserPicture(user);

      const isRequested = _(drive.requests).findWhere({userId: Meteor.userId()});
      //console.log("Requested drive", isRequested);

      const bottomPartHeight = 75

      return (
        <div data-cucumber="screen-your-ride">
          <RideInfoWithMap width={this.props.width} height={this.props.height - bottomPartHeight} ride={ride} drive={drive} />
          <div style={{
            marginTop: 18,
            textAlign: 'center',
          }}>
            {isRequested ? (
              <RaisedButton primary style={{width: this.props.width * 0.9, borderRadius: 5}}
                data-cucumber="withdraw-request" label="Withdraw"
                secondary onClick={() => {
                  // TODO doesn't actually do anything?
                  this.showSnackbar("Trip request withdrawn");
                }}
              />
            ) : (
              <RaisedButton primary style={{width: this.props.width * 0.9, borderRadius: 5}}
                data-cucumber="request" label="Request"
                secondary onClick={() => {
                  carpoolService.requestRide(drive._id);
                  this.showSnackbar("The drive was requested");
                }}
              />
            )}
          </div>
          <Snackbar
            open={this.state.snackbarOpen}
            message={this.state.snackbarText}
            autoHideDuration={4000}
            onRequestClose={() => this.handleRequestClose()}
          />
        </div>
      )
    }
  }
}

RequestRide.propTypes = {
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
  drive: React.PropTypes.object,
  ride: React.PropTypes.object,
  stops: React.PropTypes.array,
  progress: React.PropTypes.object,
  trip: React.PropTypes.object
};

export default createContainer(({tripId, rideId}) => {
  const progress = new Progress();
  const drive = carpoolService.pullOneTrip({_id: tripId}, progress.setProgress.bind(progress, 'oneTrip'));
  const ride = rideId ? carpoolService.pullOneTrip({_id: rideId}, progress.setProgress.bind(progress, 'ride')) : null;
  const stops = carpoolService.pullStops(progress.setProgress.bind(progress, 'stops'));
  return {
    progress,
    drive,
    ride,
    stops,
  };
}, RequestRide);
