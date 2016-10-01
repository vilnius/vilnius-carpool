import React from 'react';
import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';
import { config } from '../../config'
import RepeatingDays from '../common/RepeatingDaysDisplay.jsx';
import Time from '../common/Time.jsx';
import CalendarIcon from 'material-ui/lib/svg-icons/editor/insert-invitation';
import moment from 'moment';
import { StyleSheet, css } from 'aphrodite'

/*global flowControllerHelper*/
/*global Meteor*/

const styles = StyleSheet.create({
  rightAvatarWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    top: 4,
    height: '100%',
  },
  avatarNameText: {
    fontSize: 11,
    marginTop: 5,
    color: config.colors.textColor,
    fontWeight: 500,
  },
  listItemContentWrap: {
    display: 'flex',
    flexDirection: 'column',
    color: config.colors.textColor,
  },
  tripDestinationInfoWrap: {
    marginBottom: 7,
    fontSize: 13,
    display: 'flex',
    flexDirection: 'row',
  },
  addressText: {
    display: 'inline-block',
    maxWidth: '70%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  dateInfoWrap: {
    fontSize: 12,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
})

export default class RidesListItem extends React.Component {

  constructor (props) {
    super(props);

    this.goToRideDetailView = this.goToRideDetailView.bind(this);
  }

  goToRideDetailView () {
    const myUserId = Meteor.user()._id;
    const isMyRide = myUserId === this.props.ride.owner;


    if (isMyRide && this.props.ride.role === 'rider') {
      flowControllerHelper.goToView('YourRide', {id: this.props.ride._id})
    } else if (isMyRide && this.props.ride.role === 'driver') {
      flowControllerHelper.goToView('YourDrive', {id: this.props.ride._id})
    } else {
      flowControllerHelper.goToView('RideRequest', {id: this.props.ride._id})
    }
  }

  render () {
    return (
      <ListItem key={1}
        onClick={this.goToRideDetailView}
        rightAvatar={
          <div className={css(styles.rightAvatarWrap)}>
            <Avatar src={this.props.ride.ownerAvatar} size={50} />
            <span className={css(styles.avatarNameText)}>{this.props.ride.ownerName.split(' ')[0]}</span>
          </div>
        }
      >
        <div className={css(styles.listItemContentWrap)}>
          <div className={css(styles.tripDestinationInfoWrap)}>
            <span className={css(styles.addressText)}>
              {this.props.ride.fromAddress}
            </span>
            <span style={{marginLeft: 10}}>
              <Time
                time={this.props.ride.fromTime}
                approximate={this.props.ride.fromTimeApproximate}
              />
            </span>
          </div>
          <div className={css(styles.tripDestinationInfoWrap)}>
            <span className={css(styles.addressText)}>
              {this.props.ride.toAddress}
            </span>
            <span style={{marginLeft: 10}}>
              <Time
                time={this.props.ride.toTime}
                approximate={this.props.ride.toTimeApproximate}
              />
            </span>
          </div>
          <div>{this.props.ride.repeat ? (
            <RepeatingDays daysActive={this.props.ride.repeat} />
          ) : (
            <span className={css(styles.dateInfoWrap)}>
              <CalendarIcon style={{ width: 16, height: 16, marginRight: 4, marginTop: -1.5 }} color={config.colors.main} />
              {moment(this.props.ride.time).format("MMM DD, YYYY")}
            </span>
          )}</div>
        </div>
      </ListItem>
    )
  }
}

RidesListItem.propTypes = {
  ride: React.PropTypes.object.isRequired,
}
