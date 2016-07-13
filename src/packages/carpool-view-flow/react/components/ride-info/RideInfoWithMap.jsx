import React from 'react';
import GoogleMap from '../map/GoogleMap.jsx';
import RideInfo from './RideInfo.jsx';

// TODO Make this work and use this
export default class RideInfoWithMap extends React.Component {
  render () {
    return (
      <div style={{
        width: this.props.width,
        height: this.props.height,
      }}>
        <RideInfo />
        <GoogleMap />
      </div>
    );
  }
}

RideInfoWithMap.propTypes = {
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
}
