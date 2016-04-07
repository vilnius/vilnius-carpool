import React from 'react'
import PageRoot from '../layout/PageRoot'
import FloatingActionButton from 'material-ui/lib/floating-action-button'
import ContentAdd from 'material-ui/lib/svg-icons/content/add'
import TripCard from './TripCard'

const fakeTrips = [
  {
    from: 'Antakalnio g. 10',
    to: 'Zirmunu g. 23',
    role: 'driver',
    title: 'Driver trip',
    linkTo: 'MuiDriverTrip',
  }, {
    from: 'Kriviu g. 23',
    to: 'Pylimo g. 3',
    role: 'passenger',
    title: 'Passenger trip',
    linkTo: 'MuiPassengerTrip',
  }
]

class LandingBase extends React.Component {
  render () {
    return (
      <div>
        <FloatingActionButton primary={true} onClick={() => {muiControllerHelper.goToView('MuiEditTrip')}} style={{
          position: 'absolute',
          bottom: 12,
          right: 12,
        }}>
          <ContentAdd />
        </FloatingActionButton>
        <h3 style={{textAlign: 'center', margin: 10, marginTop: 30}}>Your trips</h3>
        {fakeTrips.map((trip, i) => {
          return <TripCard key={i} trip={trip} />
        })}
      </div>
    )
  }
}

Landing = PageRoot(LandingBase)
