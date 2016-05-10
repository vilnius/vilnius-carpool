import React from 'react'
import Paper from 'material-ui/lib/paper'
import Avatar from 'material-ui/lib/avatar'
import FlatButton from 'material-ui/lib/flat-button'

export default class NotificationCard extends React.Component {
  render () {
    return (
      <Paper style={{
        width: this.props.width - 20,
        height: 110,
        margin: 5,
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
        }}>
          <div style={{marginTop: 20, marginLeft: 12}}>
            <Avatar src={this.props.notification.image} size={70} />
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
              {this.props.notification.notificationType === 'ride offer'
                ? ' offered a ride'
                : ' requested a ride'}
            </div>
            <div style={{fontSize: 10, marginTop: 5}}>{`From ${this.props.notification.from} to ${this.props.notification.to}`}</div>
            <div style={{fontSize: 10}}>{`For ${this.props.notification.date}`}</div>
            <div style={{display: 'flex', flexDirection: 'row', marginTop: 5, marginLeft: -12}}>
              <FlatButton label={this.props.notification.notificationType === 'ride offer'
                ? 'Request a ride'
                : 'Offer a ride'}
                secondary
              />
              <FlatButton label="Review" secondary />
            </div>
          </div>
        </div>
      </Paper>
    )
  }
}
