import React from 'react'
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider'
import Avatar from 'material-ui/lib/avatar';
import { config } from '../config'
import ReccuringDays from './ReccuringDays'

function getRandomBool() {
  return Math.random() < 0.5
}

export default class RidesList extends React.Component {
  render () {
    const { progress, activeTrips, ownTrips} = this.props;
    return (
      <List style={{marginTop: -4}}>
        {activeTrips.map((ride) => {
          // >> Mocking
          ride.name = "Ana"
          ride.isReccuring = getRandomBool();
          ride.reccuringDays = [getRandomBool(), getRandomBool(), getRandomBool(),
            getRandomBool(), getRandomBool(), getRandomBool(), getRandomBool()];
          ride.fromTime = '8:35';
          ride.toTime = '9:15';
          ride.toTimeApproximate = true;
          // << Mocking
          return (
            [<ListItem key={1}
              onClick={() => flowControllerHelper.goToView('MuiRequestRide')}
              rightAvatar={
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', top: 4, height: '100%'}}>
                  <Avatar src="http://lorempixel.com/200/200/people/1" size={50} />
                  <span style={{fontSize: 11, marginTop: 5, color: config.colors.textColor, fontWeight: 500}}>{ride.name}</span>
                </div>
              }
            >
              <div style={{display: 'flex', flexDirection: 'column', color: config.colors.textColor}}>
                <div style={{marginBottom: 7, fontSize: 13}}>{ride.fromAddress} {ride.fromTimeApproximate ? '~' + ride.fromTime : ride.fromTime}</div>
                <div style={{marginBottom: 10, fontSize: 13}}>{ride.toAddress} {ride.toTimeApproximate ? '~' + ride.toTime : ride.toTime}</div>
                <div>{ride.isReccuring ? (
                  <ReccuringDays daysActive={ride.reccuringDays}
                  />
                ) : (
                  <span style={{fontSize: 12}}>{moment(ride.time).format("lll")}</span>
                )}</div>
              </div>
            </ListItem>,
            <Divider key={2}/>]
          )
        })}
      </List>
    )
  }
}

RidesList.propTypes = {
  progress: React.PropTypes.object,
  activeTrips: React.PropTypes.array,
  ownTrips: React.PropTypes.array
};

RidesList.childContextTypes = {
  muiTheme: React.PropTypes.object,
}
