import React from 'react'
import PageRoot from '../layout/PageRoot'

class PassengerTripBase extends React.Component {
  render () {
    return (
      <div>
        <div>Passenger Trip</div>
        <div><b>From: </b>New York</div>
        <div><b>To: </b>Las Vegas</div>
        <div>Matching trips:</div>
        <div>Trip 1 info</div>
        <div>Trip 2 info</div>
      </div>
    )
  }
}

PassengerTrip = PageRoot(PassengerTripBase)
