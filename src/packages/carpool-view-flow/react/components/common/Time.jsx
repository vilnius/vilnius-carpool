import React from 'react';
import TimeIcon from 'material-ui/lib/svg-icons/action/schedule'

import { config } from '../../config.js';

const commonStyle = {
  display: 'flex',
  flexDirection:' row',
  alignItems: 'center',
};

const approximateTimeStyle = {
  ...commonStyle,
  color: '#888',
}

const timeStyle = {
  ...commonStyle,
}

const Time = (props) => (
  <div style={props.approximate ? approximateTimeStyle : timeStyle}>
    {props.approximate
      ? '~'
      : <TimeIcon color={config.colors.main} style={{ width: 14, height: 12 }} />
    }
    {props.time}
  </div>
);

Time.propTypes = {
  approximate: React.PropTypes.bool,
  time: React.PropTypes.any.isRequired,
}

export default Time
