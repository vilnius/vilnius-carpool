import React from 'react'
import wrapMobileLayout from './NewMobileWrap'
import GoogleMap from '../map/GoogleMap'
import TopBar from './components/TopBar'
import Avatar from 'material-ui/lib/avatar';
import BackButton from './components/BackButton'
import RepeatingDays from './components/RepeatingDays'
import ChatIcon from 'material-ui/lib/svg-icons/communication/chat'
import config from './config'
import RaisedButton from 'material-ui/lib/raised-button';
import muiTheme from './muiTheme'
import ThemeManager from 'material-ui/lib/styles/theme-manager';

const testStyle = {
  // borderLeft: '1px dotted black',
  marginLeft: 12,
  paddingLeft: 12,
  position: 'relative',
}

const rideInfoLineWrap = {
  display: 'flex',
  flexDirection: 'row',
  marginBottom: 2,
  paddingBottom: 4,
}

const circleStyle = {
  width: 11,
  height: 11,
  background: '#fff',
  borderRadius: '50%',
  position: 'absolute',
  left: -3,
  top: 4,
  borderWidth: '3px',
  borderStyle: 'solid',
}

export default class RequestRide extends React.Component {

  getChildContext () {
    return {
      muiTheme: ThemeManager.getMuiTheme(muiTheme),
    }
  }

  render () {
    const topBarHeight = 45
    const mapHeight = 375
    return (
      <div style={{color: config.colors.textColor}}>
        <TopBar
          leftIcon={<BackButton />}
          middleContent="Ride offer"
        />
        <div style={{
          width: window.innerWidth,
          height: mapHeight,
          marginTop: topBarHeight
        }}>
          <GoogleMap />
        </div>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <div style={{display: 'flex', flexDirection: 'row'}}>
            <div style={{width: window.innerWidth * 0.6}}>
              <div style={{display: 'flex', flexDirection: 'column', margin: 20, position: 'relative'}}>
                <div style={{
                  position: 'absolute',
                  width: 0,
                  height: 80,
                  left: 41,
                  top: 10,
                  borderLeft: '1px dotted #929292',
                }}>
                </div>
                <div style={rideInfoLineWrap}>
                  <div>8:15</div>
                  <div style={testStyle}>
                    <div style={{...circleStyle, borderColor: 'gray'}}></div>
                    Home
                  </div>
                </div>
                <div style={rideInfoLineWrap}>
                  <div>
                    8:25
                  </div>
                  <div style={testStyle}>
                    <div style={{...circleStyle, borderColor: 'green'}}></div>
                    Gabijos g.
                  </div>
                </div>
                <div style={rideInfoLineWrap}>
                  <div>9:00</div>
                  <div style={testStyle}>
                    <div style={{...circleStyle, borderColor: 'red'}}></div>
                    Akropolis (Šeškinė)
                  </div>
                </div>
                <div style={rideInfoLineWrap}>
                  <div>9:10</div>
                  <div style={testStyle}>
                    <div style={{...circleStyle, borderColor: 'gray'}}></div>
                    Work
                  </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', marginTop: 8}}>
                  <RepeatingDays daysActive={[false, true, true, false, true, false, false]}/>
                </div>
              </div>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', width: window.innerWidth * 0.4, alignItems: 'center'}}>
              <Avatar src="http://lorempixel.com/200/200/people/9" size={75} style={{marginTop: 16}} />
              <div style={{marginTop: 6}}>Vytaute, 26</div>
              <div style={{marginTop: 12}}><ChatIcon color={config.colors.main} /></div>
            </div>
          </div>
          <div style={{
            marginTop: 18,
            textAlign: 'center',
          }}>
            <RaisedButton primary style={{width: window.innerWidth * 0.9, borderRadius: 5}} label="Request ride"/>
          </div>
        </div>
      </div>
    )
  }
}

RequestRide.childContextTypes = {
  muiTheme: React.PropTypes.object,
}

RequestRideScreen = RequestRide
