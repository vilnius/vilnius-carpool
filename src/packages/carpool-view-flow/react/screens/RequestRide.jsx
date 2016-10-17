import React from 'react'
import RaisedButton from 'material-ui/lib/raised-button';
import Snackbar from 'material-ui/lib/snackbar';
import Loader from '../components/common/Loader'
import TripInfoWithMap from '../components/ride-info/TripInfoWithMap.jsx';

import { StyleSheet, css } from 'aphrodite'

const styles = StyleSheet.create({
  screenWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
})

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
    const {progress, itinerary, user, isRequested, driveId} = this.props;

    if (progress.getProgress() != 100) {
      return (
        <section style={{height: "100%", marginTop: 25}}>
          <Loader />
        </section>
      );
    } else {
      // d("Request ride itinerary", itinerary);
      let [{path}] = itinerary
      //d("Just for cucumber check", path);

      const bottomPartHeight = 65
      return (
        <div data-cucumber={path ? "screen-your-ride-routed" : "screen-your-ride"}
          className={css(styles.screenWrap)}
        >
          <TripInfoWithMap
            itinerary={itinerary}
            width={this.props.width} height={this.props.height - bottomPartHeight}
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
                carpoolService.requestRide(driveId);
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

RequestRide.propTypes = {
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
  stops: React.PropTypes.array,
  progress: React.PropTypes.object,
  user: React.PropTypes.object,
  itinerary: React.PropTypes.array,
  isRequested: React.PropTypes.object,
  driveId: React.PropTypes.string,
};
