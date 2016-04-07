import React from 'react'
import PageRoot from '../layout/PageRoot'

class DriverTripBase extends React.Component {
  render () {
    return (
      <div>
        <div>Driver Trip</div>
        <div><b>From: </b>Rome</div>
        <div><b>To: </b>Paris</div>
        <div>Trip Requests:</div>
        <div>Request 1 info</div>
        <div>Request 2 info</div>
      </div>
    )
  }
}

DriverTrip = PageRoot(DriverTripBase)
