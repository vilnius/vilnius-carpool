import React from 'react'
import PageRoot from '../layout/PageRoot'
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';

const notifications = [{
  info: 'You have a new matched trip',
  text: 'Matched trip for passenger trip from place1 to place2',
  linkTo: 'MuiPassengerTrip',
}, {
  info: 'Received a request for your trip',
  text: 'Your driver trip from place x to place y has received a passenger request',
  linkTo: 'MuiDriverTrip',
}]

class NotificationsBase extends React.Component {
  render () {
    return (
      <div>
      <List>
        {notifications.map((notification, i) => (
          <div>
            <ListItem
              key={i}
              onClick={() => muiControllerHelper.goToView(notification.linkTo)}
              primaryText={notification.info}
              secondaryText={notification.text}
            />
            <Divider />
          </div>
        ))}
      </List>
      </div>
    )
  }
}

Notifications = PageRoot(NotificationsBase)
