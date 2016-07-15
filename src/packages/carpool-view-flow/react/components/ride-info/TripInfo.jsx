/*
  Refactoring of RideInfo - RideInfo should be removed

  View component to show itenary
*/

/*eslint no-prototype-builtins: "off"*/
import React from 'react'
import { config } from '../../config'
import moment from 'moment'
import { Avatar } from 'material-ui'
import ChatIcon from 'material-ui/lib/svg-icons/communication/chat'
import {L_mapAndWrap} from './lambda'
/*global FlowRouter*/

const d = console.log.bind(console);

const destinationTitleStyle = {
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

export default class TripInfo extends React.Component {
  constructor(props) {
    super(props)
    this.gotoChat = this.gotoChat.bind(this);
  }

  gotoChat() {
    //d("Open chat window", this.props);
    FlowRouter.go("Chat", {cdUser: this.props.tripOwner});
  }

  renderItenaryLine(routePoint, color) {
    circleStyle.borderColor = color;
    return (
      <div key={routePoint._id+"-"+routePoint.name} style={rideInfoLineWrap} data-cucumber="stops-on-route" >
        {routePoint.time ? moment(routePoint.time).format('H:mm') : "--:--"}
        <div style={destinationTitleStyle} data-cucumber="stop">
          <div style={{...circleStyle}} />
          <div data-cucumber={"route-"+routePoint.name}
            style={{
              height: 20,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: window.innerWidth - 185
            }}
          >
            {routePoint.address}
          </div>
        </div>
      </div>
    )
  }

  render () {
    const {itenary, tripOwner} = this.props;
    const {colors} = config;
    const itenaryStops = L_mapAndWrap(itenary, this.renderItenaryLine, colors.red, colors.yellow, colors.green);

    return (
      <div style={{display: 'flex', flexDirection: 'row', fontSize: 13}}>
        <div style={{width: this.props.width - 100}}>
          <div style={{display: 'flex', flexDirection: 'column', margin: 20, position: 'relative'}}>
            <div style={{
              position: 'absolute',
              width: 0,
              height: (25 * (itenaryStops.length-1)),
              left: 47,
              top: 10,
              borderLeft: '1px dotted #929292',
            }}>
            </div>
            {itenaryStops}
          </div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', width: 100, alignItems: 'center'}}>
          <Avatar src={tripOwner.driverPicture} size={75} style={{marginTop: 16}} />
          <div style={{marginTop: 6, textAlign: 'center'}}>
            {tripOwner.driverName.split(' ')[0] + ', ' + tripOwner.driverAge}
          </div>
          <div style={{marginTop: 12}}>
            <ChatIcon data-cucumber="chat" color={config.colors.main} onClick={this.gotoChat} />
          </div>
        </div>
      </div>
    );
  }
}

TripInfo.propTypes = {
  // [A, sA, ... ,sB, B] - each point:
  itenary: React.PropTypes.array,
  tripOwner: React.PropTypes.object,
  width: React.PropTypes.number.isRequired,
}
