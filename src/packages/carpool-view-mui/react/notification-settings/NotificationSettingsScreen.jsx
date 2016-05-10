import React from 'react'
import wrapScreen from '../layout/wrapScreen'

export default class NotificationSettings extends React.Component {
  render () {
    return (
      <div>
        TODO NotificationSettings
      </div>
    )
  }
}

NotificationSettingsScreen = wrapScreen(NotificationSettings, {
  title: 'Notification settings',
  innerScreen: true,
})
