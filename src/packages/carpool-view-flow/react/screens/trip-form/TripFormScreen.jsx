import { createContainer } from 'meteor/react-meteor-data';
import React from 'react';
//import { TAPi18n} from 'meteor/tap:i18n';
import {__} from 'meteor/carpool-i18n'
import { config } from '../../config'
import DateTimePicker from '../../components/common/DateTimePicker'
import RepeatingDaysSelector from '../../components/common/RepeatingDaysSelector.jsx'
import Loader from '../../components/common/Loader'
import { FlowHelpers } from '../../../flowHelpers'
import { d, da } from 'meteor/spastai:logw'

import { TextField, RaisedButton, FlatButton, Snackbar, RadioButtonGroup, RadioButton } from 'material-ui'
import moment from 'moment'

import { googleServices } from 'meteor/spastai:google-client';

/*global google*/
/*global Progress*/
/*global carpoolService*/
/*global _*/
/*global FlowRouter*/
/*global flowControllerHelper*/

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

var service = null;
googleServices.afterInit(function (){
  service = new google.maps.places.AutocompleteService();
})
const getLocationSuggestions = (inputVal, callback) => {
  if (service && inputVal) {
    service.getQueryPredictions({
        input: inputVal,
        location: new google.maps.LatLng(54.67704, 25.25405),
        radius: 30000
      }, function(suggestions, status) {
      if (status != google.maps.places.PlacesServiceStatus.OK) {
        return callback([]);
      }
      callback(_(suggestions).pluck("description"));
    });
  } else {
    return callback([]);
  }
}

class TripForm extends React.Component {
  constructor(props) {
    super(props)

    this.locationDetectionSnackbarClose = this.locationDetectionSnackbarClose.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.openDateTimePicker = this.openDateTimePicker.bind(this);

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
      role: 'driver',
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
      d(this.props.from, this.props.fromAddress, "resolved", address)
      if("" === this.state.from) this.setState({from: address});
    })
    carpoolService.resolveLocation(this.props.to, this.props.toAddress, (address) => {
      this.setState({to: address});
    })
  }

  locationDetectionSnackbarClose() {
    this.setState({
      locationDetectionError: false,
    })
  }

  handleRequestClose() {
    //d("Close snackbar")
    this.setState({
      snackbarOpen: false,
    });
  }

  showSnackbar() {
    this.setState({
      snackbarOpen: true
    });
  }

  showErrorSnackbar(message) {
    //d("Showing error message", message)
    this.setState({
      errorSnackbarMessage: message,
      errorSnackbarOpen: true
    });
  }

  closeErrorSnackbar() {
    //d("Close snackbar")
    this.setState({
      errorSnackbarOpen: false,
    });
  }

  valueChanged(valueName, e) {
    this.setState({[valueName]: e.target.value})
  }

  // TODO is this used?
  fromInputUpdate (val) {
    getLocationSuggestions(val, (suggestions) => this.setState({
      fromSuggestions: suggestions
    }))
    this.setState({
      from: val,
    })
  }

  fromInputSelect (val) {
    this.setState({
      from: val,
      fromLoc: undefined // reset location received from url
    })
  }

  toInputUpdate (val) {
    getLocationSuggestions(val, (suggestions) => this.setState({
      toSuggestions: suggestions
    }))
    this.setState({
      to: val,
    })
  }

  toInputSelect (val) {
    this.setState({
      to: val,
    })
  }

  openDateTimePicker () {
    this.picker.openDateTimePicker(this.state.isDepartureDate, this.state.date)
  }

  submitForm () {
    let trip = {
      fromAddress: this.state.from,
      toAddress: this.state.to,
      time: this.state.date.toDate(),  // TODO move to bTime
      bTime: this.state.date.toDate(),
      role: this.state.role,
      fromLoc: this.state.fromLoc,
      toLoc: this.state.toLoc
    }
    if(false == this.state.dontRepeat) {
      trip.repeat = this.state.repeatingDays;
    }

    da(["trip-crud"], "Submitting trip:", trip)
    this.showSnackbar();
    carpoolService.saveTrip(trip, (error, routedTrip) => {
      if (error) {
        da(["trip-crud"], "Submission error:", error)
        this.showErrorSnackbar("Can't save trip. Please refine from/to addresses");
      } else {
        da(["trip-crud"], "Submited trip", routedTrip)
        //flowControllerHelper.goToView('YourTrips', {tripType: "driver" === trip.role ? "drives" : "rides"});
        if("driver" === trip.role) {
          //d("Routing to trip", routedTrip)
          flowControllerHelper.goToView('YourDrive', {id: routedTrip._id});
        } else {
          flowControllerHelper.goToView('YourRide', {id: routedTrip._id});
        }
      }
    });
    da(["trip-crud"], "Submitting - change button state", trip)
  }

  locationInputClicked (locationType) {
    if (locationType === 'from') {
      FlowRouter.withReplaceState(() => {
        FlowHelpers.goExtendedQuery('LocationAutocomplete', {screen: "NewRide", field:"aLoc"})
      })
    } else {
      FlowRouter.withReplaceState(() => {
        FlowHelpers.goExtendedQuery('LocationAutocomplete', {screen: "NewRide", field:"bLoc"})
      })
    }
  }

  render() {
    //console.log(this.state.repeatingDays, this.state.dontRepeat)
    const topBarHeight = 45
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
          <div style={{
            marginTop: topBarHeight
          }}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: this.props.width, padding: 5}}>
              <TextField id="trip-fromAddress" floatingLabelText={__('labelFrom')} value={this.state.from}
                onChange={(event)=>{ this.setState({from: event.target.value}) }}
                onClick={(e) => this.locationInputClicked('from', e)}
              />
              <TextField id="trip-toAddress" floatingLabelText={__('labelTo')} value={this.state.to}
                onChange={(event)=>{ this.setState({to: event.target.value}) }}
                onClick={(e) => this.locationInputClicked('to', e)}
              />
              <div style={{
                maxWidth: this.props.width * 0.85,
              }}>
                <b>{this.state.isDepartureDate ? 'Depart at:' : 'Arrive by:'}</b>
                {' ' + this.state.date.format('ddd, MMM D, H:mm')}
                <FlatButton label="Edit" secondary onClick={this.openDateTimePicker} />
                <DateTimePicker ref={(picker) => { this.picker = picker }} onDateSelected={({date, isDepartureDate}) => this.setState({date, isDepartureDate})} />
              </div>
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
              <RadioButtonGroup name="driver" valueSelected={this.state.role} style={{marginTop: 20, marginBottom: 20}}
                onChange={(_, value) => this.setState({role: value})}
              >
                <RadioButton
                  value="driver"
                  label="Driver"
                />
                <RadioButton
                  value="rider"
                  label="Passenger"
                />
              </RadioButtonGroup>
              <div style={{display: 'flex', flexDirection: 'row', marginTop: 15 }}>
                <RaisedButton label={'Submit'} className="saveTrip" primary onClick={this.submitForm} />
                <RaisedButton style={{marginLeft: 10}} label={'Cancel'} secondary onClick={() => FlowRouter.go("RideOffers")} />
              </div>
              <Snackbar
                open={this.state.locationDetectionError}
                message="Failed to detect your location, please enter it manually."
                autoHideDuration={3500}
                onRequestClose={this.locationDetectionSnackbarClose}
              />
              <Snackbar
                open={this.state.snackbarOpen}
                message="Saving your trip"
                autoHideDuration={4000}
                onRequestClose={() => this.handleRequestClose()}
              />
              <Snackbar
                open={this.state.errorSnackbarOpen}
                message={this.state.errorSnackbarMessage}
                autoHideDuration={4000}
                onRequestClose={() => this.closeErrorSnackbar()}
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
}

export default createContainer(() => {
  const progress = new Progress();
  const stops = carpoolService.pullStops(progress.setProgress.bind(progress, 'stops'));
  return {
    progress,
    stops
  }
}, TripForm);
