import React from 'react';
import GoogleMap from '../map/GoogleMap.jsx';
import { getUserPicture } from '../../api/UserPicture.coffee'
import TripInfo from './TripInfo.jsx';
import TripMap from '../map/TripMap.jsx'
import moment from 'moment';
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
      time: drive.aTime,
      loc: drive.fromLoc,
      title: 'From',
    });
    for(let i=1; i<drive.stops.length; i++) {
      let stop = drive.stops[i];
      itenary.push({
        _id: stop._id,
        name: "st",
        address: stop.title,
        loc: stop.loc,
        time: undefined,
        title: stop.title,
      });
    }
    itenary.push({
      _id: drive._id,
      name: "dB",
      address: drive.toAddress,
      time: drive.bTime,
      loc: drive.toLoc,
      title: 'To',
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
    const rideInfoHeight = 185
    const mapHeight = this.props.height - rideInfoHeight

    const itenary = this.createItenary(ride, drive)

    const path = drive.path

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: this.props.width,
        height: this.props.height,
      }}>
        <div style={{ height: mapHeight, width: this.props.width }}>
          <TripMap itenary={itenary}
            width={this.props.width} height={mapHeight}
            path={path}
          />
          {/*<GoogleMap ride={ride} trip={drive} />*/}
        </div>
        <TripInfo itenary={itenary}
          tripOwner={this.formDriveOwner(user)}
          width={this.props.width} height={rideInfoHeight}
          tripTime={moment(drive.time)}
          repeat={drive.repeat}
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
