import React from 'react'
import { createContainer } from 'meteor/react-meteor-data';

import Paper from 'material-ui/lib/paper'
import Avatar from 'material-ui/lib/avatar'
import FlatButton from 'material-ui/lib/flat-button'
import Loader from '../components/Loader'

import {d, da} from 'meteor/spastai:logw'
import { getUserPicture } from '../api/UserPicture.coffee'

//import {NotificationClient} from "meteor/carpool-notifications"

class NotificationClient {
  dismissAlert(id) {
    NotificationHistory.update( { _id: id }, {$set: {'recievedAt': new Date()}})
  }

  isNew(notification) {
    return undefined == notification.recievedAt;
  }
}

notificationClient = new NotificationClient()

class NotificationCard extends React.Component {
  render () {
    const { cardProgress, notification, trip, snack} = this.props;
    //d("Show notification", this.props);
    if (100 != cardProgress.getProgress()) {
      return (
        <section style={{height: "100%", marginTop: 25}} >
          <Loader size={0.4} />
        </section>
      );
    } else {
      //d("Notification", trip);
      if(undefined != trip) {
        user = Meteor.users.findOne({_id: trip.owner});
        avatar = getUserPicture(user);

        isRequested = _(trip.requests).findWhere({userId: Meteor.userId()});
        // This is for a first request as MVP starts with one
        isConfirmed = trip.requests[0] && "accept" === trip.requests[0].response;
        //d("Trip requested", isRequested, trip);
      } else if("message" === notification.reason) {
        //d("Show notification card", notification)
      } else {
        console.warn("Not known notification type");
        return;
      }
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
              {(() => {
                switch (this.props.notification.reason) {
                  case "matched":   return (
                  <div style={{display: 'flex', flexDirection: 'column', width: this.props.width - 100, paddingLeft: 22, paddingTop: 10, }}>
                    <div style={{fontWeight: notificationClient.isNew(notification) ? "bold":"normal"}}>Trip matched</div>
                    <div style={{fontSize: 10, marginTop: 5}}>{`From ${trip.fromAddress} to ${trip.toAddress}`}</div>
                    <div style={{fontSize: 10}}>{moment(trip.time).format("lll")}</div>

                    <div style={{display: 'flex', flexDirection: 'row', marginTop: 5, marginLeft: -12}}>
                      { !!isRequested ? (
                        <FlatButton data-cucumber="withdraw-request" label='Withdraw'
                          secondary onClick={() => {
                            notificationClient.dismissAlert(notification._id)
                            //carpoolService.requestRide(notification.trip)
                            snack("Request withdrawn");
                          }} />
                      ) : (
                        <FlatButton data-cucumber="request" label='Request'
                          secondary onClick={() => {
                            carpoolService.requestRide(notification.trip)
                            notificationClient.dismissAlert(notification._id)
                            snack("Ride requested");
                          }} />
                      ) }
                      <FlatButton data-cucumber="review" label="Review" secondary
                        onClick={() => {
                          flowControllerHelper.goToView('RideRequest', {id: notification.trip})
                          notificationClient.dismissAlert(notification._id)
                        }} />
                    </div>
                  </div>
                  )

                  case "request": return (
                  <div style={{display: 'flex', flexDirection: 'column', width: this.props.width - 100, paddingLeft: 22, paddingTop: 10, }}>
                    <div style={{fontWeight: notificationClient.isNew(notification) ? "bold":"normal"}}>Ride request</div>
                    <div style={{fontSize: 10, marginTop: 5}}>{`From ${trip.fromAddress} to ${trip.toAddress}`}</div>
                    <div style={{fontSize: 10}}>{moment(trip.time).format("lll")}</div>

                    <div style={{display: 'flex', flexDirection: 'row', marginTop: 5, marginLeft: -12}}>
                    { !!isConfirmed ? (
                      <FlatButton data-cucumber="withdraw-confirm" label='Withdraw'
                        secondary onClick={() => {
                          console.log("Withdraw confirm", notification)
                          notificationClient.dismissAlert(notification._id)
                          snack("Confirmation withdrawn");
                        }} />
                    ) : (
                      <FlatButton data-cucumber="confirm" label='Confirm'
                        secondary onClick={() => {
                          carpoolService.acceptRequest(notification.context, "accept", ()=>d("Acception result", arguments));
                          notificationClient.dismissAlert(notification._id),
                          snack("Request confirmed");
                        }} />
                    ) }
                      <FlatButton data-cucumber="review" label="Review" secondary
                        onClick={() => {
                          flowControllerHelper.goToView('RideConfirm', {id: notification.trip})
                          notificationClient.dismissAlert(notification._id)
                        }} />
                        <FlatButton data-cucumber="chat" label="Chat" secondary
                          onClick={() => {
                            FlowRouter.go("Chat", {cdUser: this.props.notification.userId});
                          }} />
                    </div>
                  </div>
                  )

                  case "confirmation": return (
                  <div style={{display: 'flex', flexDirection: 'column', width: this.props.width - 100, paddingLeft: 22, paddingTop: 10, }}>
                    <div style={{fontWeight: notificationClient.isNew(notification) ? "bold":"normal"}}>Ride confirmation</div>
                    <div style={{fontSize: 10, marginTop: 5}}>{`From ${trip.fromAddress} to ${trip.toAddress}`}</div>
                    <div style={{fontSize: 10}}>{moment(trip.time).format("lll")}</div>

                    <div style={{display: 'flex', flexDirection: 'row', marginTop: 5, marginLeft: -12}}>
                      <FlatButton data-cucumber="withdraw-confirmed" label='Withdraw'
                        secondary onClick={() => {
                          console.log("Withdraw confirmed request", notification)
                          notificationClient.dismissAlert(notification._id)
                          snack("Confirmed request withdrawn");
                        }} />
                      <FlatButton data-cucumber="review-confirmed" label="Review" secondary
                        onClick={() => {
                          flowControllerHelper.goToView('RideRequest', {id: notification.trip})
                          notificationClient.dismissAlert(notification._id)
                        }} />
                      <FlatButton data-cucumber="review-chat" label="Chat" secondary
                        onClick={() => {
                          FlowRouter.go("Chat", {cdUser: this.props.notification.userId});
                        }} />
                    </div>
                  </div>
                  )

                  case "message": return (
                  <div style={{display: 'flex', flexDirection: 'column', width: this.props.width - 100, paddingLeft: 22, paddingTop: 10, }}>
                    <div style={{fontWeight: notificationClient.isNew(notification) ? "bold":"normal"}}>New message</div>
                    <div style={{fontSize: 10, marginTop: 5}}>{notification.context.text}</div>

                    <div style={{display: 'flex', flexDirection: 'row', marginTop: 5, marginLeft: -12}}>
                      <FlatButton data-cucumber="view-message" label="View" secondary
                        onClick={() => {
                          flowControllerHelper.goToView('Chat', {cdUser: notification.context.from})
                          notificationClient.dismissAlert(notification._id)
                        }} />
                    </div>
                  </div>
                  )

                }
              })()}
          </div>
        </Paper>
      )
    }
  }
}

NotificationCard.propTypes = {
  cardProgress: React.PropTypes.object,
  notification: React.PropTypes.object,
  trip: React.PropTypes.object,
  snack: React.PropTypes.func,
};

/*
 This component is loading data and is called from the other container (compoment which loads data)
  It shouldn't work as parent container loads list of notifications and then each item does subscribtion to trip.
  As these subscribtions are done in reactive computation, previous subscribtion should be stopped.

  However each NotificationCardContainer is running different object computation, so it has own subscribtion
  handler, thus doesn't stop other cards.
*/
export default NotificationCardContainer = createContainer(({notification, snack}) => {
  const cardProgress = new Progress();
  if("matched" === notification.reason || "request" === notification.reason || "confirmation" === notification.reason) {
    trip = carpoolService.pullOneTrip({_id: notification.trip}, cardProgress.setProgress.bind(cardProgress, 'oneTrip'));
  }
  //d("NotificationCard progress", cardProgress.getProgress(), "trip", trip);
  //d("Notification", notification, trip)
  return {
    cardProgress,
    notifications,
    trip,
    snack
  };
}, NotificationCard);
