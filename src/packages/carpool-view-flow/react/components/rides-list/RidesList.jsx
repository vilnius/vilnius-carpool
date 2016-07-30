import React from 'react'
import List from 'material-ui/lib/lists/list';
import Divider from 'material-ui/lib/divider'
import moment from 'moment';

import { getUserName } from 'meteor/carpool-view'
import { getUserPicture } from '../../api/UserPicture.coffee'
import Loader from '../common/Loader'
import RidesListItem from './RidesListItem.jsx';
/*global Meteor*/

export default class RidesList extends React.Component {
  render () {
    const { progress, trips } = this.props;
    if (100 != progress.getProgress()) {
      return (
        <section style={{height: "100%", marginTop: 25}}>
          <Loader />
        </section>
      );
    } else {
      return (
        <List data-cucumber="trips-list">
          {trips.map((ride) => {
            const user = Meteor.users.findOne({_id: ride.owner});
            ride.ownerName = getUserName(user);
            ride.ownerAvatar = getUserPicture(user);
            //d("Repeat ", ride.repeat);
            ride.fromTime = moment(ride.aTime).format('H:mm');
            ride.toTime = moment(ride.bTime).format('H:mm');
            ride.toTimeApproximate = true;
            // << Mocking
            return (
              [
                <RidesListItem key={1} ride={ride} />,
                <Divider key={2} />
              ]
            )
          })}
        </List>
      )
    }
  }
}

RidesList.propTypes = {
  progress: React.PropTypes.object,
  activeTrips: React.PropTypes.array,
  ownTrips: React.PropTypes.array,
  trips: React.PropTypes.array,
};

RidesList.childContextTypes = {
  muiTheme: React.PropTypes.object,
}
