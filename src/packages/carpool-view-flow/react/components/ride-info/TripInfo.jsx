/*
  Refactoring of RideInfo - RideInfo should be removed

  View component to show itinerary
*/

/*eslint no-prototype-builtins: "off"*/
import React from 'react'
import { config } from '../../config'
import moment from 'moment'
import { Avatar } from 'material-ui'
import ChatIcon from 'material-ui/lib/svg-icons/communication/chat'
import {L_mapAndWrap} from './lambda'

import RepeatingDays from '../common/RepeatingDaysDisplay.jsx';
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

    this.renderItineraryLine = this.renderItineraryLine.bind(this)

    this.gotoChat = this.gotoChat.bind(this);
  }

  gotoChat() {
    //d("Open chat window", this.props);
    FlowRouter.go("Chat", {cdUser: this.props.tripOwner});
  }

  renderItineraryLine(routePoint, color) {
    circleStyle.borderColor = color;
    return (
      <div key={routePoint._id+"-"+routePoint.name} style={rideInfoLineWrap} data-cucumber="stops-on-route" >
        <div style={{width: 33, textAlign: 'center'}}>
          {routePoint.time ? moment(routePoint.time).format('H:mm') : "--:--"}
        </div>
        <div style={destinationTitleStyle} data-cucumber="stop">
          <div style={{...circleStyle}} />
          <div data-cucumber={"route-"+routePoint.name}
            style={{
              height: 20,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              paddingLeft: 3,
              width: this.props.width - 200,
            }}
          >
            {routePoint.address || routePoint.title}
          </div>
        </div>
      </div>
    )
  }

  render () {
    const {itinerary, tripOwner} = this.props;
    const {colors} = config;
    const itineraryStops = L_mapAndWrap(itinerary, this.renderItineraryLine, colors.red, colors.yellow, colors.green);

    return (
      <div>
        <div style={{display: 'flex', flexDirection: 'row', fontSize: 13}}>
          <div style={{width: this.props.width - 100}}>
            <div style={{display: 'flex', flexDirection: 'column', margin: 20, position: 'relative'}}>
              <div style={{
                position: 'absolute',
                width: 0,
                height: (25 * (itineraryStops.length-1)),
                left: 47,
                top: 10,
                borderLeft: '1px dotted #929292',
              }}>
              </div>
              {itineraryStops}
            </div>
            <div style={{ marginLeft: 20, fontSize: 14 }}>
              {this.props.repeat
                ? <RepeatingDays daysActive={this.props.repeat} />
                : `Trip starts ${this.props.tripTime.fromNow()} (${this.props.tripTime.format('MM-DD HH:mm')})`
              }
            </div>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', width: 100, alignItems: 'center'}}>
            <Avatar src={tripOwner.driverPicture} size={75} style={{marginTop: 16}} />
            <div style={{marginTop: 6, textAlign: 'center'}}>
              {tripOwner.driverName + ', ' + tripOwner.driverAge}
            </div>
            <div style={{marginTop: 12}}>
              <ChatIcon data-cucumber="chat" color={config.colors.main} onClick={this.gotoChat} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

TripInfo.propTypes = {
  // [A, sA, ... ,sB, B] - each point:
  itinerary: React.PropTypes.array,
  tripOwner: React.PropTypes.object,
  tripTime: React.PropTypes.object,
  repeat: React.PropTypes.array,
  width: React.PropTypes.number.isRequired,
}
