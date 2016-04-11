import React from 'react'
import HomeIcon from 'material-ui/lib/svg-icons/action/home'
import ArrowForwardIcon from 'material-ui/lib/svg-icons/navigation/arrow-forward'
import ClockIcon from 'material-ui/lib/svg-icons/action/schedule'
import CarIcon from 'material-ui/lib/svg-icons/notification/drive-eta'
import PassengerIcon from 'material-ui/lib/svg-icons/maps/directions-walk'
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';

export default class TripInfo extends React.Component {
  render () {
    console.log(this.props.trip)
    return (
      <List subheader="Trip Information">
        <ListItem
          primaryText={this.props.trip.from}
          leftIcon={<HomeIcon />}
        />
        <ListItem
          primaryText={this.props.trip.to}
          leftIcon={<ArrowForwardIcon />}
        />
        <ListItem
          primaryText={this.props.trip.time.toString().split(':00 ')[0]}
          leftIcon={<ClockIcon />}
        />
        {this.props.trip.role === 'driver' ? (
          <ListItem
            primaryText={'You are a driver'}
            leftIcon={<CarIcon />}
          />
        ) : (
          <ListItem
            primaryText={'You are a passenger'}
            leftIcon={<PassengerIcon />}
          />
        )}
      </List>
    )
  }
}
