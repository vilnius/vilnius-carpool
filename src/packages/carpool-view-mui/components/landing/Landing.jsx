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
import { createContainer } from 'meteor/react-meteor-data';

class LandingBase extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    const { progress, activeTrips, ownTrips} = this.props;

    return (
      <div>
        <FloatingActionButton className="addTrip"
          secondary={true} onClick={() => {muiControllerHelper.goToView('MuiEditTrip')}} style={{
          position: 'absolute',
          bottom: 12,
          right: 12,
        }}>
          <ContentAdd />
        </FloatingActionButton>
        {ownTrips.length > 0 ? (
          <List subheader="Your current trips">
            {ownTrips.map((trip, i) => (
              <ListItem
                className={`${trip.role}-own-trip`}
                onClick={() => {muiControllerHelper.goToView(trip.tripPage)}}
                key={i}
                leftIcon={trip.role === 'driver' ? <CarIcon /> : <PassengerIcon />}
                primaryText={`${moment(trip.time).format("lll")}`}
                secondaryText={`From ${trip.fromAddress} to ${trip.toAddress}`}
              />
            ))}
          </List>
        ) : (
          <div>
            <List subheader="Other trips">
              {activeTrips.map((trip, i) => (
                <ListItem
                  className={`${trip.role}-active-trip`}
                  onClick={() => {muiControllerHelper.goToView(trip.tripPage)}}
                  key={i}
                  leftIcon={trip.role === 'driver' ? <CarIcon /> : <PassengerIcon />}
                  primaryText={`${moment(trip.time).format("lll")}`}
                  secondaryText={`From ${trip.fromAddress} to ${trip.toAddress}`}
                />
              ))}
            </List>
          </div>
        )}
      </div>
    )
  }
};

LandingBase.propTypes = {
  progress: React.PropTypes.object,
  activeTrips: React.PropTypes.array,
  ownTrips: React.PropTypes.array
};

LangingContainer = createContainer(() => {
  const progress = new Progress();
  const activeTrips = carpoolService.pullActiveTrips({}, progress.setProgress.bind(progress, 'activeTrips'));
  const ownTrips = carpoolService.pullOwnTrips({}, progress.setProgress.bind(progress, 'ownTrips'));

  return {
    progress,
    activeTrips,
    ownTrips,
  };
}, LandingBase);


Landing = PageRoot(LangingContainer)
