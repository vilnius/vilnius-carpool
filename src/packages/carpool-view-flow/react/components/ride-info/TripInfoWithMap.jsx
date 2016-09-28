import React from 'react';
import GoogleMap from '../map/GoogleMap.jsx';
import { getUserPicture } from '../../api/UserPicture.coffee'
import TripInfo from './TripInfo.jsx';
import TripMap from '../map/TripMap.jsx'
import moment from 'moment';
import { StyleSheet, css } from 'aphrodite'

const d = console.log.bind(console);


/*global getUserName*/

const styles = StyleSheet.create({
  componentWrap: {
    display: 'flex',
    flexDirection: 'column',
  },
})

// TODO Make this work and use this
export default class TripInfoWithMap extends React.Component {

  /*
  Puts the points into array - TripInfo and TripMap will display this array
  */
  formDriveOwner(user) {
    if(null == user) {
      return {}
    }
    const [name, surname] = getUserName(user).split(" ");
    return {
      driverName: name,
      driverSurname: surname,
      driverAge: 26,
      driverPicture: getUserPicture(user)
    }
  }

  render () {
    const {itinerary, user} = this.props;
    const rideInfoHeight = 175
    const mapHeight = this.props.height - rideInfoHeight
    const tripTime = undefined; // TODO carpoolService should decide what is trip time
    const repeat = []; // TODO carpoolService should provide repeat

    return (
      <div className={css(styles.componentWrap)} style={{
        width: this.props.width,
        height: this.props.height,
      }}>
        <div style={{ height: mapHeight, width: this.props.width }}>
          <TripMap
            itinerary={itinerary}
            width={this.props.width} height={mapHeight}
          />
          {/*<GoogleMap ride={ride} trip={drive} />*/}
        </div>
        <TripInfo
          itinerary={itinerary}
          tripOwner={this.formDriveOwner(user)}
          width={this.props.width} height={rideInfoHeight}
          tripTime={moment(tripTime)}
          repeat={repeat}
        />
      </div>
    );
  }
}

TripInfoWithMap.propTypes = {
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
  user: React.PropTypes.object,
  itinerary: React.PropTypes.array
}
