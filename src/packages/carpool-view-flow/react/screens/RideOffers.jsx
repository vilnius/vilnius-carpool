import React from 'react';
import RidesList from '../components/rides-list/RidesList';
import Loader from '../components/common/Loader.jsx';
import { FlatButton, Snackbar, Divider } from 'material-ui';
import { StyleSheet, css } from 'aphrodite';

import { createDrive, createRide } from '../redux/modules/general/actions.js';

/*global FlowRouter*/

const styles = StyleSheet.create({
  screenWrap: {
    display: 'flex',
    flexDirection: 'column',
  },
  headerWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  createTripButtonsWrap: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
})

export default class RideOffersScreen extends React.Component {
  constructor (props) {
    super(props);

    this.createDrive = this.createDrive.bind(this);
    this.createRide = this.createRide.bind(this);

    this.state = {
      errorSnackbarOpen: false,
      errorSnackbarMessage: '',
    }
  }

  showError (errorMessage) {
    this.setState({
      errorSnackbarOpen: true,
      errorSnackbarMessage: errorMessage,
    })
  }

  createDrive () {
    this.props.dispatch(createDrive((err) => {
      this.showError(err);
    }));
  }

  createRide () {
    this.props.dispatch(createRide((err) => {
      this.showError(err);
    }));
  }

  render () {
    if (100 != this.props.progress.getProgress()) {
      return (
        <section style={{height: "100%", marginTop: 25}}>
          <Loader />
        </section>
      );
    } else {
      if (!this.props.locationFrom || !this.props.locationTo || !this.props.tripDateTime) {
        FlowRouter.go('NewRide');
      }
      return (
        <div className={css(styles.screenWrap)}>
          <div className={css(styles.headerWrap)}>
            <div style={{fontSize: 12}}>
              {'Searching for a trip from '}
              <b>{this.props.locationFrom}</b>
              {' to '}
              <b>{this.props.locationTo}</b>
              {' at '}
              <b>{this.props.tripDateTime.format('YYYY-MM-DD HH:mm')}</b>
            </div>
            <FlatButton label="Edit" style={{minWidth: 55, height: 40}} secondary onClick={() => FlowRouter.go('NewRide')} />
          </div>
          <Divider />
          <div className={css(styles.createTripButtonsWrap)}>
            <FlatButton data-cucumber="create-drive-button" secondary label="Create Drive" onClick={this.createDrive} />
            <FlatButton data-cucumber="create-ride-button" secondary label="Create Ride" onClick={this.createRide} />
          </div>
          <Divider />
          <RidesList trips={this.props.trips} progress={this.props.progress} />
          <Snackbar
            open={this.state.errorSnackbarOpen}
            message={this.state.errorSnackbarMessage}
            autoHideDuration={4000}
            onRequestClose={() => this.setState({ errorSnackbarOpen: false })}
          />
        </div>
      )
    }
  }
}

RideOffersScreen.propTypes = {
  progress: React.PropTypes.object.isRequired,
  trips: React.PropTypes.array.isRequired,
  locationFrom: React.PropTypes.string.isRequired,
  locationTo: React.PropTypes.string.isRequired,
  tripDateTime: React.PropTypes.object.isRequired,
  dispatch: React.PropTypes.func.isRequired,
}
