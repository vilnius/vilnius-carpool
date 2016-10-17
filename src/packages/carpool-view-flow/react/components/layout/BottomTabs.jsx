import React from 'react'
import { createContainer } from 'meteor/react-meteor-data';

import Paper from 'material-ui/lib/paper'
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import NotificationsIcon from 'material-ui/lib/svg-icons/social/notifications'
import CarIcon from 'material-ui/lib/svg-icons/maps/directions-car'
import RequestsIcon from 'material-ui/lib/svg-icons/action/feedback'
import PersonIcon from 'material-ui/lib/svg-icons/social/person'
import { config } from '../../config'

/*global flowControllerHelper*/
/*global Progress*/
/*global Meteor*/
/*global NotificationHistory*/

class BottomTabs extends React.Component {
  render () {
    const notificationsAmount = this.props.notificationsAmount || 0
    // const { notificationsAmount } = this.props
    return (
      <Paper style={{
        position: 'fixed',
        bottom: this.props.bottomOffset,
        height: this.props.height,
        width: this.props.width,
        zIndex: 1,
        color: 'white'
      }}>
        <Tabs style={{height: 60}} inkBarStyle={{display: 'none'}} value={this.props.selectedTabIndex}>
          <Tab
            style={{fontSize: 10, background: '#212121'}}
            icon={<RequestsIcon className="tabs-icon" />}
            label="Requests"
            onClick={() => flowControllerHelper.goToView('RideRequests')}
            value={0}
          />
          <Tab
            style={{fontSize: 10, background: '#212121'}}
            icon={<CarIcon className="tabs-icon" />}
            label="Offers"
            onClick={() => flowControllerHelper.goToView('RideOffers')}
            value={1}
          />
          <Tab
            style={{fontSize: 10, background: '#212121'}}
            icon={<PersonIcon className="tabs-icon" />}
            label="My Trips"
            onClick={() => flowControllerHelper.goToView('YourRides')}
            value={2}
          />
          <Tab
            style={{fontSize: 10, background: '#212121'}}
            icon={<NotificationsIcon className="tabs-icon" />}
            label={
              <div style={{position: 'relative'}}>
                Notifications
                {notificationsAmount ? (
                  <div style={{position: 'absolute', left: this.props.width / 8 - 9, top: -32, borderRadius: '50%', background: config.colors.highlight, width: 14, height: 14, lineHeight: '15px'}}>                    <div style={{marginLeft: -1}}>{notificationsAmount}</div>
                  </div>
                ) : null}
              </div>
            }
            onClick={() => flowControllerHelper.goToView('Notifications')}
            value={3}
          />
        </Tabs>
      </Paper>
    )
  }
}

BottomTabs.propTypes = {
  notificationsAmount: React.PropTypes.number,
  bottomOffset: React.PropTypes.number.isRequired,
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
  selectedTabIndex: React.PropTypes.number.isRequired,
};

export default createContainer(() => {
  const progress = new Progress();
  let notificationsAmount
  var handle = Meteor.subscribe('Notifications');
  if(handle.ready()) {
    //console.log("BottomTabsContainer handle ready")
    progress.setProgress("notifications", 100);
    var showHistory = false;
    var query = {recievedAt: {$exists: showHistory}};
    notificationsAmount = NotificationHistory.find(query).count();
  } else {
    //console.log("BottomTabsContainer progress 0")
    progress.setProgress("notifications", 0);
  }

  //console.log("BottomTabsContainer notifications found", notificationsAmount)
  return {
    notificationsAmount
  };
}, BottomTabs);
