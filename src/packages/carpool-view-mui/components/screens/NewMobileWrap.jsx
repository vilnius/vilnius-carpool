import React from 'react'
import Paper from 'material-ui/lib/paper'
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import NotificationsIcon from 'material-ui/lib/svg-icons/social/notifications'
import CarIcon from 'material-ui/lib/svg-icons/maps/directions-car'
import RequestsIcon from 'material-ui/lib/svg-icons/action/feedback'

import config from './config'

const wrapMobileLayout = (Component) => class MobileLayout extends React.Component {
  render () {
    console.log('Wraping')
    return (
      <div>
        <Paper
          style={{
            position: 'fixed',
            top: 0,
            height: 50,
            width: window.innerWidth,
            background: config.colors.main,
            zIndex: 1,
            color: 'white'
          }}
        >
          Content
        </Paper>
        <div style={{
          marginTop: 50,
          height: window.innerHeight - 100,
        }}>
          <Component width={window.innerWidth} height={window.innerHeight} />
        </div>
      </div>
    )
  }
}

export default wrapMobileLayout
