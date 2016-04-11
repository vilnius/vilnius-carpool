import React from 'react'
import PageRoot from '../layout/PageRoot'
import fakeData from '../../fakeData'
import TripInfo from './TripInfo'
import Requests from './Requests'
import Divider from 'material-ui/lib/divider';

class DriverTripBase extends React.Component {
  render () {
    const tripData = fakeData['id0']
    return (
      <div>
        <TripInfo trip={tripData} />
        <Divider />
        <Requests requests={tripData.requests} />
      </div>
    )
  }
}

DriverTrip = PageRoot(DriverTripBase)
