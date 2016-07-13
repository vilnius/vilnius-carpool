import React from 'react';
import GoogleMap from './GoogleMap.jsx';
import RideInfo from './RideInfo.jsx';

export default class RideInfoWithMap extends React.Component {
  render () {
    return (
      <div style={{
        width: this.props.width,
        height: this.props.height,
      }}>

      </div>
    );
  }
}

RideInfoWithMap.propTypes = {
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
}
