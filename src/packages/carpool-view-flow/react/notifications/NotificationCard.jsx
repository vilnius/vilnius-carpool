import React from 'react'
import { createContainer } from 'meteor/react-meteor-data';

import Paper from 'material-ui/lib/paper'
import Avatar from 'material-ui/lib/avatar'
import FlatButton from 'material-ui/lib/flat-button'

class NotificationCardComponent extends React.Component {
  render () {
    const { progress, notification, trip} = this.props;
    //console.log("Show notification", notification);
    if (100 != progress.getProgress()) {
      return (
        <section style={{height: "100%"}}>
          Loading...
        </section>
      );
    } else {
      user = Meteor.users.findOne({_id: trip.owner});
      avatar = user && user.profile && user.profile.avatar;
      return (
        <Paper data-cucumber="notification" style={{
          width: this.props.width - 20,
          height: 110,
          margin: 5,
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
          }}>
            <div style={{marginTop: 20, marginLeft: 12}}>
              <Avatar src={avatar} size={70} />
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              width: this.props.width - 100,
              paddingLeft: 22,
              paddingTop: 10,
            }}>
              <div>
                {this.props.notification.name}
                {this.props.notification.reason === 'matched'
                  ? ' Trip matched'
                  : ' Ride request'}
              </div>
              <div style={{fontSize: 10, marginTop: 5}}>{`From ${trip.fromAddress} to ${trip.toAddress}`}</div>
              <div style={{fontSize: 10}}>{`For ${this.props.notification.date}`}</div>
              <div style={{display: 'flex', flexDirection: 'row', marginTop: 5, marginLeft: -12}}>
                <FlatButton data-cucumber="request" label={this.props.notification.reason === 'matched'
                  ? 'Request a ride'
                  : 'Confirm a ride'}
                  secondary
                  onClick={() => {
                    carpoolService.requestRide(notification.trip)
                    flowControllerHelper.goToView('RideRequest', {id: notification.trip})
                  }}
                />
                <FlatButton data-cucumber="review" label="Review" secondary
                  onClick={() => flowControllerHelper.goToView('RideRequest', {id: notification.trip})} />
              </div>
            </div>
          </div>
        </Paper>
      )
    }
  }
}

NotificationCardComponent.propTypes = {
  progress: React.PropTypes.object,
  notification: React.PropTypes.object,
  trip: React.PropTypes.object,
};

export default NotificationCard = createContainer(({notification}) => {
  const progress = new Progress();
  const trip = carpoolService.pullOneTrip({_id: notification.trip}, progress.setProgress.bind(progress, 'oneTrip'));

  return {
    progress,
    notifications,
    trip
  };
}, NotificationCardComponent);
