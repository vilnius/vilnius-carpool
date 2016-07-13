import React from 'react'
import { config } from '../../config'
import moment from 'moment'
import { Avatar } from 'material-ui'
import ChatIcon from 'material-ui/lib/svg-icons/communication/chat'
/*global FlowRouter*/

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
    //d("Open chat window", this.props);
    FlowRouter.go("Chat", {cdUser: this.props.drive.owner});
  }

  render () {
    //d("Showing stops", this.props.ride.stops)
    const {ride, drive} = this.props;
    //d("RideInfo props", this.props)
    const stops = [];
    for(var i=1; i < drive.stops.length; i++) {
      const routePoint = drive.stops[i];
      stops.push(
        <div key={routePoint._id} style={rideInfoLineWrap} data-cucumber="stops-on-route" >
          <div>{routePoint.time}</div>
          <div style={destinationTitleStyle} data-cucumber="stop">
            <div style={{...circleStyle,
              borderColor: 'yellow' }}></div>
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
              height: 25 + (25 * stops.length),
              left: 47,
              top: 10,
              borderLeft: '1px dotted #929292',
            }}>
            </div>
            {ride ? (
              <div key={ride._id+"-ra"} style={rideInfoLineWrap}  >
                {moment(ride.aTime).format('H:mm')}
                <div style={destinationTitleStyle}>
                  <div style={{...circleStyle, borderColor: 'grey' }}></div>
                  <div data-cucumber="ride-from"
                    style={{
                      height: 20,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      width: window.innerWidth - 185
                    }}
                  >
                    {ride.fromAddress}
                  </div>
                </div>
              </div>
            ) : null}
            <div key={drive._id+"-a"} style={rideInfoLineWrap}  >
              {moment(drive.aTime).format('H:mm')}
              <div style={destinationTitleStyle}>
                <div style={{...circleStyle, borderColor: 'red' }}></div>
                <div data-cucumber="drive-from"
                  style={{
                    height: 20,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    width: window.innerWidth - 185
                  }}
                >
                  {drive.fromAddress}
                </div>
              </div>
            </div>
            {stops}
            <div key={drive._id+"-b"} style={rideInfoLineWrap}  >
              {moment(drive.bTime).format('H:mm')}
              <div style={destinationTitleStyle}>
                <div style={{...circleStyle, borderColor: 'green' }}></div>
                <div
                  style={{
                    height: 20,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    width: window.innerWidth - 185
                  }}
                >
                  {drive.toAddress}
                </div>
              </div>
            </div>
            {ride ? (
              <div key={ride._id+"-rb"} style={rideInfoLineWrap}  >
                {moment(ride.bTime).format('H:mm')}
                <div style={destinationTitleStyle}>
                  <div style={{...circleStyle, borderColor: 'grey' }}></div>
                  <div style={{height: 20, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: window.innerWidth - 185}}>
                    {ride.toAddress}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', width: 100, alignItems: 'center'}}>
          <Avatar src={this.props.drive.driverPicture} size={75} style={{marginTop: 16}} />
          <div style={{marginTop: 6, textAlign: 'center'}}>
            {this.props.drive.driverName.split(' ')[0] + ', ' + this.props.drive.driverAge}
          </div>
          <div style={{marginTop: 12}}>
            <ChatIcon data-cucumber="chat" color={config.colors.main} onClick={this.gotoChat} />
          </div>
        </div>
      </div>
    )
  }
}

RideInfo.propTypes = {
  drive: React.PropTypes.object,
  ride: React.PropTypes.object,
  width: React.PropTypes.number.isRequired,
}
