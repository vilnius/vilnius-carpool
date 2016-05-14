import React from 'react'
import RecurringDays from './ReccuringDays'
import Avatar from 'material-ui/lib/avatar';
import ChatIcon from 'material-ui/lib/svg-icons/communication/chat'
import { config } from '../config'

const destinationTitleStyle = {
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

export default class RideInfo extends React.Component {
  render () {
    return (
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <div style={{width: this.props.width * 0.6}}>
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
              {this.props.ride.stops.map((routePoint) => (
                <div style={rideInfoLineWrap} key={routePoint._id} >
                  <div>{routePoint.time}</div>
                  <div style={destinationTitleStyle}>
                    <div style={{...circleStyle,
                      borderColor: routePoint.pickupPoint ? 'green' :
                                   routePoint.dropoffPoint ? 'red' : 'gray'
                    }}></div>
                      {routePoint.title}
                  </div>
                </div>
              ))}
            <div style={{display: 'flex', flexDirection: 'row', marginTop: 8}}>
              <RecurringDays daysActive={[false, true, true, false, true, false, false]}/>
            </div>
          </div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', width: this.props.width * 0.4, alignItems: 'center'}}>
          <Avatar src={this.props.ride.driverPicture} size={75} style={{marginTop: 16}} />
          <div style={{marginTop: 6}}>{this.props.ride.driverName + ', ' + this.props.ride.driverAge}</div>
          <div style={{marginTop: 12}}><ChatIcon color={config.colors.main} /></div>
        </div>
      </div>
    )
  }
}
