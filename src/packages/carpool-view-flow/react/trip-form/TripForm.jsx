import wrapScreen from '../layout/wrapScreen'
//import { TAPi18n} from 'meteor/tap:i18n';
import {__} from 'meteor/carpool-i18n'
import { config, muiTheme } from '../config'
import DateTimePicker from '../components/DateTimePicker'

import AutoComplete from 'material-ui/lib/auto-complete';
import { TextField, DatePicker, TimePicker, RaisedButton, FlatButton, Snackbar, RadioButtonGroup, RadioButton } from 'material-ui'
import Colors from 'material-ui/lib/styles/colors';
import LocationIcon from 'material-ui/lib/svg-icons/action/room'
import moment from 'moment'

import { googleServices } from 'meteor/spastai:google-client';

// TODO: replace this with real function
const detectLocation = (callback) => {
  setTimeout(() => {
    const detectedLocation = 'Konstitucijos pr. 3'
    const error = Math.random() > 0.5 ? null : 'Random error for testing'
    callback(error, detectedLocation)
  }, 1500)
}

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
    callback([]);
  }
}

export default class TripForm extends React.Component {
  constructor(props) {
    super(props)
    const currDate = new Date()
    this.state = {
      from: '',
      to: '',
      fromSuggestions: [],
      toSuggestions: [],
      date: moment(),
      isDepartureDate: false,
      role: 'driver',
      locationReceived: false,
      locationDetectionError: false,
      snackbarOpen: false
    }
  }

  componentWillMount() {
    carpoolService.resolveLocation(this.props.from, this.props.fromAddress, (address) => {
      console.log(this.props.from, this.props.fromAddress, "resolved", address)
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
  };


  valueChanged(valueName, e) {
    this.setState({[valueName]: e.target.value})
  }

  muiValueChanged(valueName, _, value) {
    this.setState({[valueName]: value})
  }

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
    this.refs.picker.openDateTimePicker(this.state.isDepartureDate, this.state.date)
  }

  handleChange(event) {
    console.log(event.target.value);
    this.setState({to: event.target.value});
  }

  submitForm () {
    let trip = {
      fromAddress: this.state.from,
      toAddress: this.state.to,
      time: this.state.date.toDate(),  // TODO move to bTime
      bTime: this.state.date.toDate(),
      role: this.state.role,
    }
    da(["trip-crud"], "Submitting trip:", trip)
    this.showSnackbar();
    carpoolService.saveTrip(trip, function(error, routedTrip){
      if (error) {
        da(["trip-crud"], "Submission error:", error)
      } else {
        da(["trip-crud"], "Submited trip", routedTrip)
        //flowControllerHelper.goToView('MyTrips', {tripType: "driver" === trip.role ? "drives" : "rides"});
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

  render() {
    const topBarHeight = 45

    const leftColWidth = 80

    //TAPi18n.__('labelFrom'); // dummy call to load __ functions -doesn't help
    return (
      <div style={{color: config.colors.textColor}}>
        <div style={{
          marginTop: topBarHeight
        }}>

        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: this.props.width, padding: 5}}>

          <TextField id="trip-fromAddress" floatingLabelText={__('labelFrom')} value={this.state.from}
            onChange={(event)=>{ this.setState({from: event.target.value}) }} />
          <TextField id="trip-toAddress" floatingLabelText={__('labelTo')} value={this.state.to}
            onChange={(event)=>{ this.setState({to: event.target.value}) }} />

          {/*<DatePicker hintText={__('labelDate')} style={{marginTop: 20}} value={this.state.date} onChange={this.muiValueChanged.bind(this, 'date')} />
          <TimePicker hintText={__('labelTime')} style={{marginTop: 20}} format='24hr' value={this.state.time} onChange={this.muiValueChanged.bind(this, 'time')} />*/}
          <div>
            <b>{this.state.isDepartureDate ? 'Depart at:' : 'Arrive by:'}</b>
            {' ' + this.state.date.format('ddd, MMM D, k:mm')}
            <DateTimePicker ref="picker" onDateSelected={({date, isDepartureDate}) => this.setState({date, isDepartureDate})} />
            <FlatButton label="Edit" secondary onClick={this.openDateTimePicker.bind(this)} />
          </div>
          <RadioButtonGroup name="driver" valueSelected={this.state.role} style={{marginTop: 20, marginBottom: 20}} onChange={this.muiValueChanged.bind(this, 'role')}>
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
            <RaisedButton label={'Submit'} className="saveTrip" primary={true} onClick={this.submitForm.bind(this)} />
            <RaisedButton label={'Cancel'} secondary={true} onClick={() => FlowRouter.go("RideOffers")} />
          </div>
          <Snackbar
            open={this.state.locationDetectionError}
            message="Failed to detect your location, please enter it manually."
            autoHideDuration={3500}
            onRequestClose={this.locationDetectionSnackbarClose.bind(this)}
          />
          <Snackbar
            open={this.state.snackbarOpen}
            message="Saving your trip"
            autoHideDuration={4000}
            onRequestClose={() => this.handleRequestClose()}
          />

        </div>
      </div>
    </div>
    )
  }
}

// TODO Extract to css some day or replace with current styles
var styles = {
  datesWrapper: {
    display: 'flex',
  },
  buttonsWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
  button: {
    width: 'auto',
  },
  fullWidthInput: {
    width: 300,
  },
  timeInput: {
    width: 80,
  },
  dateInput: {
    width: 100,
  },
}

TripFormScreen = wrapScreen(TripForm, {
  innerScreen: false,
  title: 'New Ride Request',
})
