import React from 'react'
import GoogleMap from '../components/GoogleMap'
import { config, muiTheme } from '../config'
import RaisedButton from 'material-ui/lib/raised-button';
import wrapScreen from '../layout/wrapScreen'
import RideInfo from '../components/RideInfo'

const ride = {
  driverName: 'Vytautė',
  driverAge: 26,
  driverPicture: 'http://lorempixel.com/200/200/people/9',
  route: [{
    title: 'Home',
    time: '8:15',
  }, {
    title: 'Gabijos g.',
    time: '8:25',
    pickupPoint: true,
  }, {
    title: 'Akropolis (Šeškinė)',
    time: '9:00',
    dropoffPoint: true,
  }, {
    title: 'Work',
    time: '9:10',
  }],
}

export default class RequestRide extends React.Component {

  render () {
    const topBarHeight = 45
    const mapHeight = 375
    return (
      <div style={{color: config.colors.textColor}}>
        <div style={{
          width: window.innerWidth,
          height: mapHeight,
          marginTop: topBarHeight
        }}>
          <GoogleMap />
        </div>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <RideInfo ride={ride} width={this.props.width} />
          <div style={{
            marginTop: 18,
            textAlign: 'center',
          }}>
            <RaisedButton primary style={{width: window.innerWidth * 0.9, borderRadius: 5}}
              label="Request ride"
              onClick={() => {alert('Modal with timechoice coming')}}
            />
          </div>
        </div>
      </div>
    )
  }
}

RequestRideScreen = wrapScreen(RequestRide, {
  innerScreen: true,
  title: 'Ride offer',
})
