import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import RidesList from '../../components/rides-list/RidesList';
import { connect } from 'react-redux';
import Loader from '../../components/common/Loader.jsx';
import locationFromSelector from '../../redux/selectors/locationFrom.js';
import locationToSelector from '../../redux/selectors/locationTo.js';
import tripDateTimeSelector from '../../redux/selectors/tripDateTime.js';
import { FlatButton } from 'material-ui';

/*global Progress*/
/*global carpoolService*/
/*global FlowRouter*/

class RideOffersScreen extends React.Component {
  render () {
    if (100 != this.props.progress.getProgress()) {
      return (
        <section style={{height: "100%", marginTop: 25}}>
          <Loader />
        </section>
      );
    } else {
      if (!this.props.locationFrom || !this.props.locationTo || !this.props.tripDateTime) {
        FlowRouter.go('NewRide');
      }
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
            }}
          >
            <div style={{fontSize: 12}}>
              {'Searching for a trip from '}
              <b>{this.props.locationFrom}</b>
              {' to '}
              <b>{this.props.locationTo}</b>
              {' at '}
              <b>{this.props.tripDateTime.format('YYYY-MM-DD HH:mm')}</b>
            </div>
            <FlatButton label="Edit" style={{minWidth: 55, height: 40}} secondary onClick={() => FlowRouter.go('NewRide')} />
          </div>
          <RidesList trips={this.props.trips} progress={this.props.progress} />
        </div>
      )
    }
  }
}

RideOffersScreen.propTypes = {
  progress: React.PropTypes.object.isRequired,
  trips: React.PropTypes.array.isRequired,
  locationFrom: React.PropTypes.string.isRequired,
  locationTo: React.PropTypes.string.isRequired,
  tripDateTime: React.PropTypes.object.isRequired,
}

const connectedRideOffersScreen = connect((state) => ({
  locationFrom: locationFromSelector(state),
  locationTo: locationToSelector(state),
  tripDateTime: tripDateTimeSelector(state),
}))(RideOffersScreen)

export default createContainer(({filterOwn = "all", role = "driver", aLoc, bLoc, bTime}) => {
  const progress = new Progress();
  const query = {
    role: role,
    fromLoc: aLoc,
    toLoc: bLoc,
    bTime: bTime && bTime.toDate()
  }
  let trips
  //d("RideOffersList query", bTime);
  // Some magic here to remove undefined values
  Object.keys(query).forEach((key)=>{ query[key] || delete query[key] });

  //console.log("Filter query:", query, aLoc)
  if("your" == filterOwn) {
    trips = carpoolService.pullOwnTrips(query, progress.setProgress.bind(progress, 'ownTrips'));
    if(100 == progress.getProgress()) {
       //d(`Own ${role} trips:`, trips);
    }
  } else {
    trips = carpoolService.pullActiveTrips(query, progress.setProgress.bind(progress, 'activeTrips'));
    if(100 == progress.getProgress()) {
      //d(`All ${role} trips:`, trips);
    }
  }

  return {
    progress,
    trips
  };
}, connectedRideOffersScreen);
