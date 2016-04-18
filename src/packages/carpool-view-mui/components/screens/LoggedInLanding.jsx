import React from 'react'
import Paper from 'material-ui/lib/paper'

import TripSearch from './components/TripSearch'

export default class LoggedInLanding extends React.Component {
  render () {
    const width = window.innerWidth // TODO take from props
    const height = window.innerHeight // TODO take from props
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        background: `url('http://lorempixel.com/${width}/${height}/city/9')`,
        width,
        height,
      }}>
        <div style={{
          margin: 25,
          marginTop: 77,
        }}>
          <Paper style={{
            background: 'rgba(255, 255, 255, 0.91)',
            padding: 12,
          }}>
            <TripSearch width={width - 25 * 2 - 12 * 2} />
          </Paper>
        </div>
      </div>
    )
  }
}

LoggedInLandingScreen = LoggedInLanding
