import React from 'react'
import RaisedButton from 'material-ui/lib/raised-button';
import Snackbar from 'material-ui/lib/snackbar';
import Loader from '../components/common/Loader'
import TripInfoWithMap from '../components/ride-info/TripInfoWithMap.jsx';
import { StyleSheet, css } from 'aphrodite'

/*global carpoolService*/

const styles = StyleSheet.create({
  screenWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
})

export default class YourRide extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
        snackbarOpen: false,
        snackbarText: ''
      };
  }

  handleRequestClose() {
    this.setState({
      snackbarOpen: false,
    });
  }

  showSnackbar(message) {
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
      const isRequested = false;
      //const isRequested = _(drive.requests).findWhere({userId: Meteor.userId()});

      const bottomPartHeight = 65

      return (
        <div data-cucumber="screen-your-ride" className={css(styles.screenWrap)}>
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
                carpoolService.requestRide(this.props.itinerary._id);
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
  itinerary: React.PropTypes.array,
};
