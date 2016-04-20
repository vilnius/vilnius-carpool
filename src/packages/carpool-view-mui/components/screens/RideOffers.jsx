import React from 'react'
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider'
import Avatar from 'material-ui/lib/avatar';
import TopBar from './components/TopBar'
import BottomTabs from './components/BottomTabs'
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import ContentAdd from 'material-ui/lib/svg-icons/content/add';
import HamburgerMenuButton from './components/HamburgerMenuButton'
import { createContainer } from 'meteor/react-meteor-data';


import wrapMobileLayout from './NewMobileWrap'
import config from './config'

const filledCircleStyle = {
  background: config.colors.main,
  color: 'white',
  marginRight: 4,
  width: 15,
  height: 15,
  borderRadius: 999,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: 9,
}

const emptyCircleStyle = {
  background: 'white',
  color: config.colors.main,
  border: '1px solid ' + config.colors.main,
  marginRight: 4,
  width: 15,
  height: 15,
  borderRadius: 999,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: 9,
}

export default class RideOffers extends React.Component {
  render () {
    const { progress, activeTrips, ownTrips} = this.props;

    return (
      <div style={{paddingBottom: 64}}>
        <TopBar
          extraContent ={(
            <Tabs>
              <Tab label="All" />
              <Tab label="Yours" />
            </Tabs>
          )}
          middleContent="RideOffers"
          leftIcon={<HamburgerMenuButton />}
          rightIcon={'o'}
        />
        <List>
          {activeTrips.map((trip) => {
            return (
              [<ListItem key={1}
                onClick={() => muiControllerHelper.goToView('MuiRequestRide', {}, {trip: trip._id})}
                rightAvatar={
                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', top: 4, height: '100%'}}>
                    <Avatar src='http://lorempixel.com/200/200/people/1' size={50} />
                    <span style={{fontSize: 11, marginTop: 5, color: '#9B9B9B', fontWeight: 500}}>{trip.name}</span>
                  </div>
                }
              >
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <div style={{marginBottom: 7, fontSize: 14}}>From: {trip.fromAddress}</div>
                  <div style={{marginBottom: 10, fontSize: 14}}>To: {trip.toAddress}</div>
                  <div>{Math.random() > 0.6 ? (
                    <span style={{fontSize: 12}}>{moment(trip.time).format("lll")}</span>
                  ) : (
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                      {['M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                        <div key={i} style={Math.random() > 0.5 ? filledCircleStyle : emptyCircleStyle}>
                          {day}
                        </div>
                      ))}
                    </div>
                  )}</div>
                </div>
              </ListItem>,
              <Divider key={2}/>]
            )
          })}
        </List>
        <BottomTabs />
        <FloatingActionButton secondary={true} style={{
            position: 'fixed',
            right: 12,
            bottom: 75,
          }}
          className="addTrip-test"
          onClick={() => {muiControllerHelper.goToView('MuiEditTrip')}}
        >
          <ContentAdd />
        </FloatingActionButton>
      </div>
    )
  }
}

RideOffers.propTypes = {
  progress: React.PropTypes.object,
  activeTrips: React.PropTypes.array,
  ownTrips: React.PropTypes.array
};


RideOffersScreen = createContainer(() => {
  const progress = new Progress();
  const activeTrips = carpoolService.pullActiveTrips({}, progress.setProgress.bind(progress, 'activeTrips'));
  const ownTrips = carpoolService.pullOwnTrips({}, progress.setProgress.bind(progress, 'ownTrips'));

  return {
    progress,
    activeTrips,
    ownTrips,
  };
}, RideOffers);
