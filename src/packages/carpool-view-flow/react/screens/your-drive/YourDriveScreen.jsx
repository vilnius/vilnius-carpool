import React from 'react'
import { createContainer } from 'meteor/react-meteor-data';

import { _ } from 'meteor/underscore';

import GoogleMap from '../../components/map/GoogleMap'
import { config } from '../../config'
import RaisedButton from 'material-ui/lib/raised-button';
import RideInfo from '../../components/ride-info/RideInfo'
import Loader from '../../components/common/Loader'
import { getUserPicture } from '../../api/UserPicture.coffee'
/*global Meteor*/
/*global getUserName*/
/*global carpoolService*/
/*global Progress*/


class YourDrive extends React.Component {

  render () {
    const topBarHeight = 45
    const mapHeight = 375
    const {progress, drive, stops} = this.props;

    if (100 != progress.getProgress()) {
      return (
        <section style={{height: "100%", marginTop: 25}}>
          <Loader />
        </section>
      );
    } else {
      //console.log("drive", drive);
      const user = Meteor.users.findOne({_id: drive.owner});
      drive.driverName = getUserName(user);
      drive.driverAge = 26;
      drive.driverPicture = getUserPicture(user);

      const isRequested = _(drive.requests).findWhere({userId: Meteor.userId()});
      //console.log("Requested drive", isRequested);
      return (
        <div data-cucumber="screen-your-drive" style={{color: config.colors.textColor}}>
          <div style={{
            width: window.innerWidth,
            height: mapHeight,
            marginTop: topBarHeight
          }}>
            <GoogleMap trip={drive} stops={stops} />
          </div>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <RideInfo drive={drive} width={this.props.width} />
            <div style={{
              marginTop: 18,
              textAlign: 'center',
            }}>
              <RaisedButton primary style={{width: window.innerWidth * 0.9, borderRadius: 5}}
                label={isRequested ? "Withdraw confirmation" : "Offer ride"}
                onClick={() => { alert('Modal with timechoice coming') }}
              />
            </div>
          </div>
        </div>
      )
    }
  }
}

YourDrive.propTypes = {
  progress: React.PropTypes.object,
  trip: React.PropTypes.object,
  drive: React.PropTypes.object,
  stops: React.PropTypes.array,
  width: React.PropTypes.number.isRequired,
};

export default createContainer(({tripId}) => {
  const progress = new Progress();
  const drive = carpoolService.pullOneTrip({_id: tripId}, progress.setProgress.bind(progress, 'oneTrip'));
  const stops = carpoolService.pullStops(progress.setProgress.bind(progress, 'stops'));

  return {
    progress,
    drive,
    stops
  };
}, YourDrive);
