import React from 'react'
import PageRoot from '../layout/PageRoot'
import fakeData from '../../fakeData'
import TripInfo from './TripInfo'
import MatchingTrips from './MatchingTrips'
import Divider from 'material-ui/lib/divider';

class PassengerTripBase extends React.Component {
  render () {
    const tripData = fakeData['id1']
    return (
      <div>
        <TripInfo trip={tripData} />
        <Divider />
        <MatchingTrips matchingTrips={tripData.matchingTrips} />
      </div>
    )
  }
}

PassengerTrip = PageRoot(PassengerTripBase)
