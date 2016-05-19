import React from 'react'
import { createContainer } from 'meteor/react-meteor-data';

import Paper from 'material-ui/lib/paper'
import Avatar from 'material-ui/lib/avatar'
import FlatButton from 'material-ui/lib/flat-button'
import Loader from '../components/Loader'

import { getUserPicture } from '../api/UserPicture.coffee'

class NotificationCard extends React.Component {
  render () {
    const { progress, notification, trip} = this.props;
    //console.log("Show notification", notification);
    if (100 != progress.getProgress()) {
      return (
        <section style={{height: "100%", marginTop: 25}}>
          <Loader size={0.4} />
        </section>
      );
    } else {
      user = Meteor.users.findOne({_id: trip.owner});
      avatar = getUserPicture(user);

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
              {this.props.notification.reason === 'matched' ? (
                <div style={{display: 'flex', flexDirection: 'row', marginTop: 5, marginLeft: -12}}>
                  <FlatButton data-cucumber="request" label='Request a ride'
                    secondary onClick={() => {
                      carpoolService.requestRide(notification.trip)
                      flowControllerHelper.goToView('RideRequest', {id: notification.trip})
                    }} />
                  <FlatButton data-cucumber="review" label="Review" secondary
                    onClick={() => flowControllerHelper.goToView('RideRequest', {id: notification.trip})} />
                </div>
              ) : (
                <div style={{display: 'flex', flexDirection: 'row', marginTop: 5, marginLeft: -12}}>
                  <FlatButton data-cucumber="confirm" label='Confirm a ride'
                    secondary onClick={() => {
                      console.log("Confirming", notification)
                      // TODO acceptRequest: (invitationId, answer, callback) ->
                      //carpoolService.requestRide(notification.trip)
                      flowControllerHelper.goToView('RideConfirm', {id: notification.trip})
                    }} />
                  <FlatButton data-cucumber="review" label="Review" secondary
                    onClick={() => flowControllerHelper.goToView('RideConfirm', {id: notification.trip})} />
                </div>
              )}
            </div>
          </div>
        </Paper>
      )
    }
  }
}

NotificationCard.propTypes = {
  progress: React.PropTypes.object,
  notification: React.PropTypes.object,
  trip: React.PropTypes.object,
};

/*
 This component is loading data and is called from the other container (compoment which loads data)
  It shouldn't work as parent container loads list of notifications and then each item does subscribtion to trip.
  As these subscribtions are done in reactive computation, previous subscribtion should be stopped.

  However each NotificationCardContainer is running different object computation, so it has own subscribtion
  handler, thus doesn't stop other cards.
*/
export default NotificationCardContainer = createContainer(({notification}) => {
  const progress = new Progress();
  const trip = carpoolService.pullOneTrip({_id: notification.trip}, progress.setProgress.bind(progress, 'oneTrip'));
  return {
    progress,
    notifications,
    trip
  };
}, NotificationCard);
