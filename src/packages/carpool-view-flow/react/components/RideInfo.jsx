import React from 'react'
import RecurringDays from './ReccuringDays'
import Avatar from 'material-ui/lib/avatar';
import ChatIcon from 'material-ui/lib/svg-icons/communication/chat'
import { config } from '../config'
import {d, da} from 'meteor/spastai:logw'

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

  constructor(props) {
    super(props)

    this.gotoChat = this.gotoChat.bind(this);
  }

  gotoChat() {
    d("Open chat window", this.props.ride.owner);
    FlowRouter.go("Chat", {cdUser: this.props.ride.owner});
  }

  render () {
    //d("Showing stops", this.props.ride.stops)
    trip = this.props.ride;
    //d("Props", this.props)
    stops = [];
    for(var i=1; i< trip.stops.length; i++) {
      routePoint = trip.stops[i];
      stops.push(
        <div key={routePoint._id} style={rideInfoLineWrap}  >
          <div>{routePoint.time}</div>
          <div style={destinationTitleStyle}>
            <div style={{...circleStyle,
              borderColor: 'gray' }}></div>
              {routePoint.title}
          </div>
        </div>
      )
    }
    return (
      <div style={{display: 'flex', flexDirection: 'row', fontSize: 13}}>
        <div style={{width: this.props.width - 100}}>
          <div style={{display: 'flex', flexDirection: 'column', margin: 20, position: 'relative'}}>
            <div style={{
              position: 'absolute',
              width: 0,
              height: 30,
              left: 47,
              top: 10,
              borderLeft: '1px dotted #929292',
            }}>
            </div>
              <div key={trip._id+"-a"} style={rideInfoLineWrap}  >
                {moment(trip.aTime).format('H:mm')}
                <div style={destinationTitleStyle}>
                  <div style={{...circleStyle, borderColor: 'green' }}></div>
                  <div style={{height: 20, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: window.innerWidth - 185}}>{trip.fromAddress}</div>
                </div>
              </div>
              {stops}
              <div key={trip._id+"-b"} style={rideInfoLineWrap}  >
                {moment(trip.bTime).format('H:mm')}
                <div style={destinationTitleStyle}>
                  <div style={{...circleStyle, borderColor: 'red' }}></div>
                  <div style={{height: 20, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: window.innerWidth - 185}}>{trip.toAddress}</div>
                </div>
              </div>

            <div style={{display: 'flex', flexDirection: 'row', marginTop: 8}}>
              <RecurringDays daysActive={[false, true, true, false, true, false, false]}/>
            </div>
          </div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', width: 100, alignItems: 'center'}}>
          <Avatar src={this.props.ride.driverPicture} size={75} style={{marginTop: 16}} />
          <div style={{marginTop: 6, textAlign: 'center'}}>{this.props.ride.driverName + ', ' + this.props.ride.driverAge}</div>
          <div style={{marginTop: 12}}><ChatIcon data-cucumber="chat" color={config.colors.main} onClick={this.gotoChat}/></div>
        </div>
      </div>
    )
  }
}
