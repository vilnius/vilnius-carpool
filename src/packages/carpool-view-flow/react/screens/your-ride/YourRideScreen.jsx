import React from 'react'
import { createContainer } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';
import RaisedButton from 'material-ui/lib/raised-button';
import Snackbar from 'material-ui/lib/snackbar';
import Loader from '../../components/common/Loader'
import TripInfoWithMap from '../../components/ride-info/TripInfoWithMap.jsx';

/*global Progress*/
/*global carpoolService*/
/*global Meteor*/

const d = console.log.bind(console);

export default class YourRide extends React.Component {

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
    const {progress, user, itinerary} = this.props;
    if (progress.getProgress() != 100) {
      return (
        <section style={{height: "100%", marginTop: 25}}>
          <Loader />
        </section>
      );
    } else {
      //d("Your ride itinerary", itinerary);

      const isRequested = false;
      //const isRequested = _(drive.requests).findWhere({userId: Meteor.userId()});
      //console.log("Requested drive", isRequested);

      const bottomPartHeight = 65

      return (
        <div data-cucumber="screen-your-ride"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <TripInfoWithMap width={this.props.width} height={this.props.height - bottomPartHeight}
            itinerary={itinerary}
            user={user}
          />
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

YourRide.propTypes = {
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
  stops: React.PropTypes.array,
  progress: React.PropTypes.object,
  user: React.PropTypes.object,
  itinenary: React.PropTypes.array,
};

export default createContainer(({rideId}) => {
  const progress = new Progress();
  const ride = rideId ? carpoolService.pullOneTrip({_id: rideId}, progress.setProgress.bind(progress, 'ride')) : null;
  const stops = carpoolService.pullStops(progress.setProgress.bind(progress, 'stops'));
  const user = ride && Meteor.users.findOne({_id: ride.owner});
  const itinerary = carpoolService.pullRiderItinerary(ride);
  // d("Your ride", ride, drive)
  return {
    progress,
    stops,
    user,
    itinerary
  };
}, YourRide);
