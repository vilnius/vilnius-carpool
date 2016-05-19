import React from 'react'
import Paper from 'material-ui/lib/paper'
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import NotificationsIcon from 'material-ui/lib/svg-icons/social/notifications'
import CarIcon from 'material-ui/lib/svg-icons/maps/directions-car'
import RequestsIcon from 'material-ui/lib/svg-icons/action/feedback'
import PersonIcon from 'material-ui/lib/svg-icons/social/person'
import { config } from '../config'

export default class BottomTabs extends React.Component {
  render () {
    const notificationsAmount = this.props.notificationsAmount || Math.floor(Math.random() * 4)
    // const { notificationsAmount } = this.props
    return (
      <Paper style={{
        position: 'fixed',
        bottom: 0,
        height: 64,
        width: window.innerWidth,
        zIndex: 1,
        color: 'white'
      }}>
        <Tabs style={{height: 60}} inkBarStyle={{display: 'none'}} value={this.props.selectedTabIndex}>
          <Tab
            style={{fontSize: 10, background: '#212121'}}
            icon={<RequestsIcon className="tabs-icon" />}
            label="Requests"
            onClick={() => {flowControllerHelper.goToView('RideRequests')}}
            value={0}
          />
          <Tab
            style={{fontSize: 10, background: '#212121'}}
            icon={<CarIcon className="tabs-icon" />}
            label="Offers"
            onClick={() => {flowControllerHelper.goToView('RideOffers')}}
            value={1}
          />
          <Tab
            style={{fontSize: 10, background: '#212121'}}
            icon={<PersonIcon className="tabs-icon" />}
            label="My Trips"
            onClick={() => {flowControllerHelper.goToView('MyTrips')}}
            value={2}
          />
          <Tab
            style={{fontSize: 10, background: '#212121'}}
            icon={<NotificationsIcon className="tabs-icon" />}
            label={
              <div style={{position: 'relative'}}>
                Notifications
                {notificationsAmount ? (
                  <div style={{position: 'absolute', left: window.innerWidth / 8 - 9, top: -32, borderRadius: '50%', background: config.colors.highlight, width: 14, height: 14, lineHeight: '15px'}}>
                    <div style={{marginLeft: -1}}>{notificationsAmount}</div>
                  </div>
                ) : null}
              </div>
            }
            onClick={() => {flowControllerHelper.goToView('Notifications')}}
            value={3}
          />
        </Tabs>
      </Paper>
    )
  }
}
