import React from 'react';
import GoogleMap from '../map/GoogleMap.jsx';
import RideInfo from './RideInfo.jsx';

// TODO Make this work and use this
export default class RideInfoWithMap extends React.Component {
  render () {
    const rideInfoHeight = 215
    const mapHeight = this.props.height - rideInfoHeight

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: this.props.width,
        height: this.props.height,
      }}>
        <div style={{ height: mapHeight, width: this.props.width }}>
          <GoogleMap ride={this.props.ride} trip={this.props.drive} />
        </div>
        <RideInfo ride={this.props.ride} drive={this.props.drive} width={this.props.width} height={rideInfoHeight} />
      </div>
    );
  }
}

RideInfoWithMap.propTypes = {
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
  ride: React.PropTypes.object,
  drive: React.PropTypes.object,
}
