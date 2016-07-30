import React from 'react'
import List from 'material-ui/lib/lists/list';
import Divider from 'material-ui/lib/divider'
import moment from 'moment';

import { getUserName } from 'meteor/carpool-view'
import { getUserPicture } from '../../api/UserPicture.coffee'
import Loader from '../common/Loader'
import RidesListItem from './RidesListItem.jsx';
/*global Meteor*/

function addUserDataToRide (ride) {
  const user = Meteor.users.findOne({_id: ride.owner});
  return {
    ...ride,
    ownerName: getUserName(user),
    ownerAvatar: getUserPicture(user),
    fromTime: moment(ride.aTime).format('H:mm'),
    toTime: moment(ride.bTime).format('H:mm'),
    toTimeApproximate: true,
  }
}

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
            return ([
              <RidesListItem key={1} ride={addUserDataToRide(ride)} />,
              <Divider key={2} />
            ])
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
