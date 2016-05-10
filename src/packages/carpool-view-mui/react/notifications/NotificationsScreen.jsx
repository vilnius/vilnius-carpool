import React from 'react'
import wrapScreen from '../layout/wrapScreen'
import NotificationCard from './NotificationCard'

const notifications = [{
  name: 'Agnė',
  date: 'May 29, 17:40',
  from: 'Akropolis',
  to: 'Naugarduko g. 65',
  notificationType: 'ride offer',
  image: 'http://lorempixel.com/200/200/people/' + Math.round(Math.random() * 9),
}, {
  name: 'Vytautas',
  date: 'May 23 15:10',
  from: 'Gabijos g. 29',
  to: 'Oro uostas',
  notificationType: 'ride request',
  image: 'http://lorempixel.com/200/200/people/' + Math.round(Math.random() * 9),
}, {
  name: 'Marijus',
  date: 'June 3 13:30',
  from :'Užupio g. 29',
  to: 'Panorama',
  notificationType: 'ride offer',
  image: 'http://lorempixel.com/200/200/people/' + Math.round(Math.random() * 9),
}]

export default class Notifications extends React.Component {
  render () {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {notifications.map((notification, i) => (
          <NotificationCard key={i} notification={notification} width={this.props.width} />
        ))}
      </div>
    )
  }
}

NotificationsScreen = wrapScreen(Notifications, {
  title: 'Notifications',
})
