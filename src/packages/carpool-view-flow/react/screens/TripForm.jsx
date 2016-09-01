import React from 'react';
//import { TAPi18n} from 'meteor/tap:i18n';
import {__} from 'meteor/carpool-i18n'
import { TextField, RaisedButton, FlatButton, Snackbar } from 'material-ui'
import { StyleSheet, css } from 'aphrodite'

import { config } from '../config'
import DateTimePicker from '../components/common/DateTimePicker'
import Loader from '../components/common/Loader'
import { FlowHelpers } from '../../flowHelpers'
import { updateTripDateTime, createDrive } from '../redux/modules/general/actions.js';

/*global FlowRouter*/

const styles = StyleSheet.create({
  screenWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 5,
  },
  actionButtonsWrap: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 15,
  },
})

export default class TripForm extends React.Component {
  constructor(props) {
    super(props)

    this.openDateTimePicker = this.openDateTimePicker.bind(this);
    this.createDrive = this.createDrive.bind(this);
    this.searchDrive = this.searchDrive.bind(this);

    this.state = {
      snackbarOpen: false,
      errorSnackbarMessage: '',
      errorSnackbarOpen: false,
    }
  }

  showErrorSnackbar(message) {
    this.setState({
      errorSnackbarMessage: message,
      errorSnackbarOpen: true
    });
  }

  openDateTimePicker () {
    this.picker.openDateTimePicker(this.state.isDepartureDate, this.props.tripDateTime)
  }

  createDrive () {
    this.props.dispatch(createDrive((err) => {
      if (err) {
        this.showErrorSnackbar("Can't save trip. Please refine from/to addresses");
      }
    }));

    this.setState({
      snackbarOpen: true,
    })
  }

  searchDrive () {
    FlowRouter.go("RideOffers");
  }

  locationInputClicked (locationType) {
    if (locationType === 'from') {
      FlowRouter.withReplaceState(() => {
        FlowHelpers.goExtendedQuery('LocationAutocomplete', {
          screen: "NewRide",
          field: "aLoc",
        })
      })
    } else {
      FlowRouter.withReplaceState(() => {
        FlowHelpers.goExtendedQuery('LocationAutocomplete', {
          screen: "NewRide",
          field: "bLoc",
        })
      })
    }
  }

  render() {
    if (100 != this.props.progress.getProgress()) {
      return (
        <section style={{height: "100%", marginTop: 25}}>
          <Loader />
        </section>
      );
    } else {
      return (
        <div style={{color: config.colors.textColor}} data-cucumber="add-trip-form">
          <div>
            <div className={css(styles.screenWrap)} style={{ width: this.props.width }}>
              <div style={{ cursor: 'pointer' }} >
                <TextField id="trip-fromAddress" floatingLabelText={__('labelFrom')} value={this.props.locationFrom}
                  data-cucumber="trip-fromAddress"
                  disabled
                  inputStyle={{ color: 'black' }}
                  onClick={(e) => this.locationInputClicked('from', e)}
                />
              </div>
              <div style={{ cursor: 'pointer' }} >
                <TextField id="trip-toAddress" floatingLabelText={__('labelTo')} value={this.props.locationTo}
                  data-cucumber="trip-toAddress"
                  disabled
                  inputStyle={{ color: 'black' }}
                  onClick={(e) => this.locationInputClicked('to', e)}
                />
              </div>
              <div style={{
                maxWidth: this.props.width * 0.85,
              }}>
                <b>{this.state.isDepartureDate ? 'Depart at:' : 'Arrive by:'}</b>
                {' ' + this.props.tripDateTime.format('ddd, MMM D, H:mm')}
                <FlatButton label="Edit" secondary onClick={this.openDateTimePicker} />
                <DateTimePicker ref={(picker) => { this.picker = picker }} onDateSelected={({date}) => this.props.dispatch(updateTripDateTime(date))} />
              </div>
              <div className={css(styles.actionButtonsWrap)}>
                <RaisedButton label={'Create drive'} data-cucumber="create-drive" primary onClick={this.createDrive} />
                <RaisedButton style={{marginLeft: 10}} data-cucumber="search" label={'Search'} secondary onClick={this.searchDrive} />
              </div>
              <Snackbar
                open={this.state.snackbarOpen}
                message="Saving your trip"
                autoHideDuration={4000}
                onRequestClose={() => this.setState({ snackbarOpen: false })}
              />
              <Snackbar
                open={this.state.errorSnackbarOpen}
                message={this.state.errorSnackbarMessage}
                autoHideDuration={4000}
                onRequestClose={() => this.setState({ errorSnackbarOpen: false })}
              />
            </div>
          </div>
        </div>
      )
    }
  }
}

TripForm.propTypes = {
  width: React.PropTypes.number.isRequired,
  progress: React.PropTypes.object.isRequired,
  locationFrom: React.PropTypes.string,
  locationTo: React.PropTypes.string,
  tripDateTime: React.PropTypes.object.isRequired,
  dispatch: React.PropTypes.func.isRequired,
}
