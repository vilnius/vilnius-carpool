
/*global carpoolService*/
import React from 'react'

import {d} from 'meteor/spastai:logw'

import RaisedButton from 'material-ui/lib/raised-button';
import Snackbar from 'material-ui/lib/snackbar';
import TripInfoWithMap from '../components/ride-info/TripInfoWithMap.jsx'
import Loader from '../components/common/Loader'

import { StyleSheet, css } from 'aphrodite'

const styles = StyleSheet.create({
  screenWrap: {
    display: 'flex',
    flexDirection: 'center',
    alignItems: 'center',
  },
})

export default class DriveConfirm extends React.Component {

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
    const {progress, user, stops, invitationId, itinerary, isRequested} = this.props;

    if (100 != progress.getProgress()) {
      return (
        <section style={{height: "100%", marginTop: 25}}>
          <Loader />
        </section>
      );
    } else {
      const bottomPartHeight = 65
      // da(["request-ride"],"Trip", trip);
      return (
        <div data-cucumber="screen-user-ride" className={css(styles.screenWrap)}>
          <TripInfoWithMap
            width={this.props.width}
            height={this.props.height - bottomPartHeight}
            itinerary={itinerary}
            user={user}
          />
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
      )
    }
  }
}

DriveConfirm.propTypes = {
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
  progress: React.PropTypes.object,
  stops: React.PropTypes.object,
  invitationId: React.PropTypes.number,
  itinerary: React.PropTypes.array,
  isRequested: React.PropTypes.object,
};
