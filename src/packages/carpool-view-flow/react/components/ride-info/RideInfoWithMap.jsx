import React from 'react';
import GoogleMap from '../map/GoogleMap.jsx';
import { getUserPicture } from '../../api/UserPicture.coffee'
import TripInfo from './TripInfo.jsx';
const d = console.log.bind(console);

/*global getUserName*/

// TODO Make this work and use this
export default class RideInfoWithMap extends React.Component {

  createItenary(ride, drive) {
    let itenary = [];
    itenary.push({
      _id: drive._id,
      name: "dA",
      address: drive.fromAddress,
      time: drive.aTime
    });
    for(let i=1; i<drive.stops.length; i++) {
      let stop = drive.stops[i];
      itenary.push({
        _id: stop._id,
        name: "st",
        address: stop.title,
        time: undefined
      });
    }
    itenary.push({
      _id: drive._id,
      name: "dB",
      address: drive.toAddress,
      time: drive.bTime
    });
    return itenary;
  }

  formDriveOwner(user) {
    if(null == user) {
      return {}
    }
    return {
      driverName: getUserName(user),
      driverAge: 26,
      driverPicture: getUserPicture(user)
    }
  }

  render () {
    const {ride, drive, user} = this.props;
    const rideInfoHeight = 200
    const mapHeight = this.props.height - rideInfoHeight

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: this.props.width,
        height: this.props.height,
      }}>
        <div style={{ height: mapHeight, width: this.props.width }}>
          <GoogleMap ride={ride} trip={drive} />
        </div>
        <TripInfo itenary={this.createItenary(ride, drive)}
          tripOwner={this.formDriveOwner(user)}
          width={this.props.width} height={rideInfoHeight}
        />
      </div>
    );
  }
}

RideInfoWithMap.propTypes = {
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
  ride: React.PropTypes.object,
  drive: React.PropTypes.object,
  user: React.PropTypes.object.isRequired,
}
