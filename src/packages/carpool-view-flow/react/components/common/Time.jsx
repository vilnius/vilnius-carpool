import React from 'react';
import TimeIcon from 'material-ui/lib/svg-icons/action/schedule'
import { StyleSheet, css } from 'aphrodite'

import { config } from '../../config.js';

const styles = StyleSheet.create({
  common: {
    display: 'flex',
    flexDirection:' row',
    alignItems: 'center',
  },
  approximateTime: {
    color: '#888',
  },
})

const Time = (props) => (
  <div className={css(styles.common, props.approximate ? styles.approximateTime : null)}>
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
