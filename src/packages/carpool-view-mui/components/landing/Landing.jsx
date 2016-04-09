import React from 'react'
import PageRoot from '../layout/PageRoot'
import FloatingActionButton from 'material-ui/lib/floating-action-button'
import ContentAdd from 'material-ui/lib/svg-icons/content/add'
import TripCard from './TripCard'
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import CarIcon from 'material-ui/lib/svg-icons/notification/drive-eta'
import PassengerIcon from 'material-ui/lib/svg-icons/maps/directions-walk'
import fakeData from '../../fakeData'

class LandingBase extends React.Component {
  render () {
    const trips = []
    for (tripId in fakeData) {
      trips.push(fakeData[tripId])
    }
    return (
      <div>
        <FloatingActionButton secondary={true} onClick={() => {muiControllerHelper.goToView('MuiEditTrip')}} style={{
          position: 'absolute',
          bottom: 12,
          right: 12,
        }}>
          <ContentAdd />
        </FloatingActionButton>
        <h4 style={{textAlign: 'center', margin: 10, marginTop: 30, marginBottom: 20}}>This feels a little too empty :(</h4>
        {trips.length > 0 ? (
          <List subheader="Your current trips">
            {trips.map((trip, i) => (
              <ListItem
                onClick={() => {muiControllerHelper.goToView(trip.tripPage)}}
                key={i}
                leftIcon={trip.role === 'driver' ? <CarIcon /> : <PassengerIcon />}
                primaryText={`${trip.time.toString().split(':00 ')[0]}`}
                secondaryText={`From ${trip.from} to ${trip.to}`}
              />
            ))}
          </List>
        ) : (
          <div>You currently have no active trips, please click plus icon at bottom left of your screen to add one</div>
        )}
      </div>
    )
  }
}

Landing = PageRoot(LandingBase)
