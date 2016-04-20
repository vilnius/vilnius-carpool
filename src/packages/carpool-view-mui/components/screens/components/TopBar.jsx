import React from 'react'
import Paper from 'material-ui/lib/paper'

import config from '../config'

export default class TopBar extends React.Component {
  render () {
    return (
      <Paper
        style={{
          position: 'fixed',
          top: 0,
          width: window.innerWidth,
          background: config.colors.main,
          zIndex: 1,
          color: 'white'
        }}
      >
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <div style={{display: 'flex', flexDirection: 'row', height: 45, alignItems: 'center'}}>
            <div style={{
              width: 45,
              height: 24,
            }}>
              <div style={{textAlign: 'center'}}>
                {this.props.leftIcon}
              </div>
            </div>
            <div style={{
              width: window.innerWidth - 90
            }}>
              {typeof this.props.middleContent === 'string' ? (
                <div style={{
                  fontSize: 20,
                  marginLeft: 5,
                }}>
                  {this.props.middleContent}
                </div>
              ) : this.props.middleContent}
            </div>
            <div style={{
              width: 45,
              height: 24,
            }}>
              <div style={{textAlign: 'center'}}>
                {this.props.rightIcon}
              </div>
            </div>
          </div>
          {this.props.extraContent}
        </div>
      </Paper>
    )
  }
}
