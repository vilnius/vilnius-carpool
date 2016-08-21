// TODO Replace with TripFormScreenNew when stable
import { createContainer } from 'meteor/react-meteor-data';
import React from 'react';
//import { TAPi18n} from 'meteor/tap:i18n';
import {__} from 'meteor/carpool-i18n'
import { config } from '../../config'
import DateTimePicker from '../../components/common/DateTimePicker'
import RepeatingDaysSelector from '../../components/common/RepeatingDaysSelector.jsx'
import Loader from '../../components/common/Loader'
import { FlowHelpers } from '../../../flowHelpers'
import { connect } from 'react-redux';

import locationFromSelector from '../../redux/selectors/locationFrom.js';
import locationToSelector from '../../redux/selectors/locationTo.js';
import tripDateTimeSelector from '../../redux/selectors/tripDateTime.js';
import { updateTripDateTime, createDrive } from '../../redux/modules/general/actions.js';


import { TextField, RaisedButton, FlatButton, Snackbar } from 'material-ui'
import moment from 'moment'

/*global Progress*/
/*global carpoolService*/
/*global FlowRouter*/

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

class TripForm extends React.Component {
  constructor(props) {
    super(props)

    this.openDateTimePicker = this.openDateTimePicker.bind(this);
    this.createDrive = this.createDrive.bind(this);
    this.searchDrive = this.searchDrive.bind(this);

    this.state = {
      from: '',
      to: '',
      fromLoc: props.from, // if something is coming form url
      toLoc: props.to,
      fromSuggestions: [],
      toSuggestions: [],
      date: props.bTime || moment(),
      isDepartureDate: false,
      repeatingDays: [],
      dontRepeat: true,
      locationReceived: false,
      locationDetectionError: false,
      snackbarOpen: false,
      errorSnackbarMessage: '',
      errorSnackbarOpen: false,
    }
    //d("Init State:", this.state)
  }

  // Some properties set to state async way
  componentWillMount() {
    // resolve address string from loc
    carpoolService.resolveLocation(this.props.from, this.props.fromAddress, (address) => {
      if("" === this.state.from) this.setState({from: address});
    })
    carpoolService.resolveLocation(this.props.to, this.props.toAddress, (address) => {
      this.setState({to: address});
    })
  }

  showErrorSnackbar(message) {
    //d("Showing error message", message)
    this.setState({
      errorSnackbarMessage: message,
      errorSnackbarOpen: true
    });
  }

  openDateTimePicker () {
    this.picker.openDateTimePicker(this.state.isDepartureDate, this.props.tripDateTime)
  }

  // submitForm () {
  //   TODO move everything to createDrive
  //   let trip = {
  //     fromAddress: this.state.from,
  //     toAddress: this.state.to,
  //     time: this.state.date.toDate(),  // TODO move to bTime
  //     bTime: this.state.date.toDate(),
  //     role: this.state.role,
  //     fromLoc: this.state.fromLoc,
  //     toLoc: this.state.toLoc
  //   }
  //   if(false == this.state.dontRepeat) {
  //     trip.repeat = this.state.repeatingDays;
  //   }
  //
  //   da(["trip-crud"], "Submitting trip:", trip)
  //   this.setState({
  //     snackbarOpen: true,
  //   })
  //   carpoolService.saveTrip(trip, (error, routedTrip) => {
  //     if (error) {
  //       da(["trip-crud"], "Submission error:", error)
  //       this.showErrorSnackbar("Can't save trip. Please refine from/to addresses");
  //     } else {
  //       da(["trip-crud"], "Submited trip", routedTrip)
  //       //flowControllerHelper.goToView('YourTrips', {tripType: "driver" === trip.role ? "drives" : "rides"});
  //       if("driver" === trip.role) {
  //         //d("Routing to trip", routedTrip)
  //         flowControllerHelper.goToView('YourDrive', {id: routedTrip._id});
  //       } else {
  //         flowControllerHelper.goToView('YourRide', {id: routedTrip._id});
  //       }
  //     }
  //   });
  //   da(["trip-crud"], "Submitting - change button state", trip)
  // }

  createDrive () {

    let trip = {
      fromAddress: this.state.from,
      toAddress: this.state.to,
      time: this.state.date.toDate(),  // TODO move to bTime
      bTime: this.state.date.toDate(),
      role: this.state.role,
      fromLoc: this.state.fromLoc,
      toLoc: this.state.toLoc
    }

    console.log(trip);

    this.props.dispatch(createDrive((err, routedTrip) => {
      if (err) {
        this.showErrorSnackbar("Can't save trip. Please refine from/to addresses");
      }
    }));

    this.setState({
      snackbarOpen: true,
    })
  }

  searchDrive () {
    if (this.props.locationFrom && this.props.locationTo && this.props.tripDateTime) {
      FlowRouter.go("RideOffers");
    } else {
      alert('You must fill in all fields');
    }
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
    //console.log(this.state.repeatingDays, this.state.dontRepeat)
    const {progress} = this.props;

    //TAPi18n.__('labelFrom'); // dummy call to load __ functions -doesn't help
    if (100 != progress.getProgress()) {
      return (
        <section style={{height: "100%", marginTop: 25}}>
          <Loader />
        </section>
      );
    } else {
      return (
        <div style={{color: config.colors.textColor}} data-cucumber="add-trip-form">
          <div>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: this.props.width, padding: 5}}>
              <TextField id="trip-fromAddress" floatingLabelText={__('labelFrom')} value={this.props.locationFrom}
                data-cucumber="trip-fromAddress"
                disabled
                inputStyle={{ color: 'black' }}
                onClick={(e) => this.locationInputClicked('from', e)}
              />
              <TextField id="trip-toAddress" floatingLabelText={__('labelTo')} value={this.props.locationTo}
                data-cucumber="trip-toAddress"
                disabled
                inputStyle={{ color: 'black' }}
                onClick={(e) => this.locationInputClicked('to', e)}
              />
              <div style={{
                maxWidth: this.props.width * 0.85,
              }}>
                <b>{this.state.isDepartureDate ? 'Depart at:' : 'Arrive by:'}</b>
                {' ' + this.props.tripDateTime.format('ddd, MMM D, H:mm')}
                <FlatButton label="Edit" secondary onClick={this.openDateTimePicker} />
                <DateTimePicker ref={(picker) => { this.picker = picker }} onDateSelected={({date}) => this.props.dispatch(updateTripDateTime(date))} />
              </div>
              {/*
                // Repeating days removed for now
                <div style={{
                  maxWidth: this.props.width * 0.85
                }}>
                  <b>Repat on: </b>
                  {this.state.dontRepeat ? 'Don\'t repeat' :
                    (6 < this.state.repeatingDays.length ? 'Everyday' :
                      this.state.repeatingDays.reduce((string, day, i) => {
                        if (0 === i) {
                          return days[day]
                        } else {
                          return string + ', ' + days[day]
                        }
                      }, '')
                    )
                  }
                  <FlatButton label="Edit" data-cucumber="recurrent-date" secondary
                    onClick={() => this.repeatingSelector.openRepeatingDaysSelector(this.state.repeatingDays, this.state.dontRepeat)}
                  />
                  <RepeatingDaysSelector ref={(repeatingSelector) => { this.repeatingSelector = repeatingSelector }} onDaysSelected={(repeatingDays, dontRepeat) => {
                    this.setState({
                      repeatingDays,
                      dontRepeat
                    })
                  }} />
                </div>
                */}
              <div style={{display: 'flex', flexDirection: 'row', marginTop: 15 }}>
                <RaisedButton label={'Create drive'} data-cucumber="create-drive" primary onClick={this.createDrive} />
                <RaisedButton style={{marginLeft: 10}} data-cucumber="search" label={'Search'} secondary onClick={this.searchDrive} />
              </div>
              <Snackbar
                open={this.state.locationDetectionError}
                message="Failed to detect your location, please enter it manually."
                autoHideDuration={3500}
                onRequestClose={() => this.setState({ locationDetectionError: false })}
              />
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

/*
 This required as stops should be loaded in order saving trip would find them
*/

TripForm.propTypes = {
  width: React.PropTypes.number.isRequired,
  from: React.PropTypes.string,
  to: React.PropTypes.string,
  bTime: React.PropTypes.number,
  progress: React.PropTypes.number.isRequired,
  stops: React.PropTypes.array.isRequired,
  fromAddress: React.PropTypes.string,
  toAddress: React.PropTypes.string,
  locationFrom: React.PropTypes.string,
  locationTo: React.PropTypes.string,
  tripDateTime: React.PropTypes.object.isRequired,
  dispatch: React.PropTypes.func.isrequired,
}

const connectedTripForm = connect((state) => ({
  locationFrom: locationFromSelector(state),
  locationTo: locationToSelector(state),
  tripDateTime: tripDateTimeSelector(state),
}))(TripForm);

export default createContainer(() => {
  const progress = new Progress();
  const stops = carpoolService.pullStops(progress.setProgress.bind(progress, 'stops'));
  return {
    progress,
    stops
  }
}, connectedTripForm);
