import React from 'react'
import Paper from 'material-ui/lib/paper'
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import NotificationsIcon from 'material-ui/lib/svg-icons/social/notifications'
import CarIcon from 'material-ui/lib/svg-icons/maps/directions-car'
import RequestsIcon from 'material-ui/lib/svg-icons/action/feedback'

export default class BottomTabs extends React.Component {
  render () {
    return (
      <Paper style={{
        position: 'fixed',
        bottom: 0,
        height: 64,
        width: window.innerWidth,
        zIndex: 1,
        color: 'white'
      }}>
        <Tabs style={{height: 64}} inkBarStyle={{display: 'none'}} value={this.props.selectedTabIndex}>
          <Tab
            style={{fontSize: 12, background: '#212121'}}
            icon={<RequestsIcon className="tabs-icon" />}
            label="Requests"
            onClick={() => {flowControllerHelper.goToView('Requests')}}
            value={0}
          />
          <Tab
            style={{fontSize: 12, background: '#212121'}}
            icon={<CarIcon className="tabs-icon" />}
            label="Offers"
            onClick={() => {flowControllerHelper.goToView('RideOffers')}}
            value={1}
          />
          <Tab
            style={{fontSize: 12, background: '#212121'}}
            icon={<NotificationsIcon className="tabs-icon" />}
            label="Notifications"
            onClick={() => {flowControllerHelper.goToView('MuiNotifications2')}}
            value={2}
          />
        </Tabs>
      </Paper>
    )
  }
}
