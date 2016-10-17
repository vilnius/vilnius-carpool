import React from 'react'
import { createContainer } from 'meteor/react-meteor-data';

import Paper from 'material-ui/lib/paper'
import Avatar from 'material-ui/lib/avatar'
import FlatButton from 'material-ui/lib/flat-button'
import Loader from '../../components/common/Loader'

import {d} from 'meteor/spastai:logw'
import { getUserPicture } from '../../api/UserPicture.coffee'
import moment from 'moment';

import { StyleSheet, css } from 'aphrodite'

//import {NotificationClient} from "meteor/carpool-notifications"
/*global NotificationHistory*/
/*global _*/
/*global Meteor*/
/*global flowControllerHelper*/
/*global FlowRouter*/
/*global carpoolService*/
/*global Progress*/

const styles = StyleSheet.create({
  cardWrap: {
    display: 'flex',
    flexDirection: 'row',
  },
  contentWrap: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 22,
    paddingTop: 10
  },
  buttonsWrap: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 5,
    marginLeft: -12
  },
})

class NotificationClient {
  dismissAlert(id) {
    NotificationHistory.update( { _id: id }, {$set: {'recievedAt': new Date()}})
  }

  isNew(notification) {
    return undefined == notification.recievedAt;
  }
}

const notificationClient = new NotificationClient()

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
      let fromUser
      let isRequested
      let isConfirmed
      //d("Notification", trip);
      if(undefined != trip) {
        fromUser = trip.owner
        isRequested = _(trip.requests).findWhere({userId: Meteor.userId()});
        // This is for a first request as MVP starts with one
        isConfirmed = trip.requests[0] && "accept" === trip.requests[0].response;
        //d("Trip requested", isRequested, trip);
      } else if("message" === notification.reason) {
        //d("Show notification card", notification)
        fromUser = notification.context.from
      } else if("matched" === notification.reason || "request" === notification.reason
          || "confirmation" === notification.reason) {
        d("Trip "+notification.reason+" without trip", notification)
      } else {
        console.warn("Not known notification type: "+notification.reason);
        return;
      }
      const user = Meteor.users.findOne({_id: fromUser});
      const avatar = getUserPicture(user);
      return (
        <Paper data-cucumber="notification" style={{
          width: this.props.width - 20,
          margin: 5,
        }}>
          <div className={css(styles.cardWrap)}>
            <div style={{marginTop: 20, marginLeft: 12}}>
              <Avatar src={avatar} size={70} />
            </div>
              {(() => {
                switch (this.props.notification.reason) {
                  case "matched":   return (
                    <div className={css(styles.contentWrap)} style={{ width: this.props.width - 100 }}>
                      <div style={{fontWeight: notificationClient.isNew(notification) ? "bold":"normal"}}>Trip matched</div>
                      <div style={{fontSize: 10, marginTop: 5}}>{`From ${trip.fromAddress} to ${trip.toAddress}`}</div>
                      <div style={{fontSize: 10}}>{moment(trip.bTime).format("lll")}</div>

                      <div className={css(styles.buttonsWrap)}>
                        {isRequested ? (
                          <FlatButton data-cucumber="withdraw-request" label="Withdraw"
                            secondary onClick={() => {
                              notificationClient.dismissAlert(notification._id)
                              //carpoolService.requestRide(notification.trip)
                              snack("Request withdrawn");
                            }}
                          />
                        ) : (
                          <FlatButton data-cucumber="request" label="Request"
                            secondary onClick={() => {
                              carpoolService.requestRide(notification.trip)
                              notificationClient.dismissAlert(notification._id)
                              snack("Ride requested");
                            }}
                          />
                        )}
                        <FlatButton data-cucumber="review-request" label="Review" secondary
                          onClick={() => {
                            //d("Goto to rideRequest", notification);
                            flowControllerHelper.goToView('RideRequest', {id: notification.trip}, {ride: notification.context._id})
                            notificationClient.dismissAlert(notification._id)
                          }}
                        />
                      </div>
                    </div>
                  )
                  case "request": return (
                    <div className={css(styles.contentWrap)} style={{ width: this.props.width - 100 }}>
                      <div style={{fontWeight: notificationClient.isNew(notification) ? "bold":"normal"}}>Ride request</div>
                      <div style={{fontSize: 10, marginTop: 5}}>{`From ${trip.fromAddress} to ${trip.toAddress}`}</div>
                      <div style={{fontSize: 10}}>{moment(trip.time).format("lll")}</div>

                      <div className={css(styles.buttonsWrap)}>
                      {isConfirmed ? (
                        <FlatButton data-cucumber="withdraw-confirm" label="Withdraw"
                          secondary onClick={() => {
                            console.log("Withdraw confirm", notification)
                            notificationClient.dismissAlert(notification._id)
                            snack("Confirmation withdrawn");
                          }}
                        />
                      ) : (
                        <FlatButton data-cucumber="confirm" label="Confirm"
                          secondary onClick={() => {
                            carpoolService.acceptRequest(notification.context, "accept", ()=>d("Acception result", arguments));
                            notificationClient.dismissAlert(notification._id)
                            snack("Request confirmed");
                          }}
                        />
                      )}
                        <FlatButton data-cucumber="review-confirm" label="Review" secondary
                          onClick={() => {
                            flowControllerHelper.goToView('RideConfirm', {id: notification.trip}, {invitation: notification.context})
                            notificationClient.dismissAlert(notification._id)
                          }}
                        />
                      </div>
                      <div>
                        <FlatButton data-cucumber="chat" label="Chat" secondary
                          onClick={() => {
                            FlowRouter.go("Chat", {cdUser: trip.owner});
                          }}
                        />
                      </div>
                    </div>
                  )
                  case "confirmation": return (
                    <div className={css(styles.contentWrap)} style={{ width: this.props.width - 100 }}>
                      <div style={{fontWeight: notificationClient.isNew(notification) ? "bold":"normal"}}>Ride confirmation</div>
                      <div style={{fontSize: 10, marginTop: 5}}>{`From ${trip.fromAddress} to ${trip.toAddress}`}</div>
                      <div style={{fontSize: 10}}>{moment(trip.time).format("lll")}</div>

                      <div className={css(styles.buttonsWrap)}>
                        <FlatButton data-cucumber="withdraw-confirmed" label="Withdraw"
                          secondary onClick={() => {
                            console.log("Withdraw confirmed request", notification)
                            notificationClient.dismissAlert(notification._id)
                            snack("Confirmed request withdrawn");
                          }}
                        />
                        <FlatButton data-cucumber="review-confirmed" label="Review" secondary
                          onClick={() => {
                            flowControllerHelper.goToView('YourRide', {id: notification.trip})
                            notificationClient.dismissAlert(notification._id)
                          }}
                        />
                      </div>
                      <div>
                        <FlatButton data-cucumber="review-chat" label="Chat" secondary
                          onClick={() => {
                            FlowRouter.go("Chat", {cdUser: trip.owner});
                          }}
                        />
                      </div>
                    </div>
                  )
                  case "message": return (
                    <div className={css(styles.contentWrap)} style={{ width: this.props.width - 100 }}>
                      <div style={{fontWeight: notificationClient.isNew(notification) ? "bold":"normal"}}>New message</div>
                      <div style={{fontSize: 10, marginTop: 5}}>{notification.context.text}</div>

                      <div className={css(styles.buttonsWrap)}>
                        <FlatButton data-cucumber="view-message" label="View" secondary
                          onClick={() => {
                            flowControllerHelper.goToView('Chat', {cdUser: notification.context.from})
                            notificationClient.dismissAlert(notification._id)
                          }}
                        />
                      </div>
                    </div>
                  )
                  default:
                    console.error('Unknown notification type');
                }
              })()}
          </div>
        </Paper>
      )
    }
  }
}

NotificationCard.propTypes = {
  width: React.PropTypes.number.isRequired,
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
export default createContainer(({notification, snack}) => {
  const cardProgress = new Progress();
  let trip;
  if("matched" === notification.reason || "request" === notification.reason || "confirmation" === notification.reason) {
    trip = carpoolService.pullOneTrip({_id: notification.trip}, cardProgress.setProgress.bind(cardProgress, 'oneTrip'));
  }
  //d("NotificationCard progress", cardProgress.getProgress(), "trip", trip);
  //d("Notification trip", trip)
  return {
    cardProgress,
    trip,
    snack
  };
}, NotificationCard);
