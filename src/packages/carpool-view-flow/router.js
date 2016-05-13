export const name = 'carpool-view-flow';

import React from 'react';
import {mount} from 'react-mounter';
import {LandingLayout, PlainLayout} from './layout'
import BottomTabs from "./react/layout/BottomTabs"
import NewRideButton from './react/layout/NewRideButton'
import TopMenu from './react/layout/TopMenu'
import TopTabs from './react/layout/TopTabs'

import RidesList from './react/components/RidesList'

import LoginScreen from './react/auth/Login'
import LoginUsernameScreen from './react/auth/LoginUsername'
import RideOffersScreen from './react/ride-list/RideOffersScreen'
import TripForm from './react/trip-form/TripForm'
import RequestRideScreen from './react/request-ride/RequestRideScreen'

function getRandomBool() {
  return Math.random() < 0.5
}

FlowRouter.route('/rideRequest/:id', {
  name: "RideRequest",
  action: function(params, queryParams) {
    mount(PlainLayout, {
      topMenu: <TopMenu title="Ride requests" innerScreen />,
      content: <RequestRideScreen tripId={params.id}/>,
    });
  }
});

FlowRouter.route('/requests/:ownTrips?', {
  name: "Requests",
  action: function(params, queryParams) {
    mount(LandingLayout, {
      topMenu: <TopMenu title="Ride requests" hasTopTabs />,
      topFilter: <TopTabs selectedTabIndex={0} />,
      content: <RideOffersScreen />,
      bottomMenu: <BottomTabs selectedTabIndex={0} />,
      extras: [<NewRideButton key={'NewRideButton'} />],
    });
  }
});

FlowRouter.route('/login', {
    name: "Login",
    action: function(params, queryParams) {
      //console.log("Routing to - new trip form", TripFormScreen);
      mount(PlainLayout, {
        content: <LoginScreen />,
      });
    }
});

FlowRouter.route('/logout', {
    name: "Logout",
    action: function(params, queryParams) {
      Meteor.logout();
      FlowRouter.go("/")
    }
});


FlowRouter.route('/loginUsername', {
    name: "LoginUsername",
    action: function(params, queryParams) {
      //console.log("Routing to - new trip form", TripFormScreen);
      mount(PlainLayout, {
        content: <LoginUsernameScreen />,
      });
    }
});

FlowRouter.route('/newRide', {
    name: "NewRideOffer",
    action: function(params, queryParams) {
      //console.log("Routing to - new trip form", TripFormScreen);
      mount(PlainLayout, {
        content: <TripForm />,
      });
    }
});

// This should be the last route as it takes optional parameter which could match all other routes
FlowRouter.route('/:ownTrips?', {
    name: "RideOffers",
    action: function(params, queryParams) {
      //console.log("Routing to - root", params.ownTrips === "your");
      mount(LandingLayout, {
        topMenu: <TopMenu title="Ride offers" hasTopTabs />,
        topFilter: <TopTabs selectedTabIndex={0} />,
        content: <RideOffersScreen filterOwn={params.ownTrips === "your"}/>,
        bottomMenu: <BottomTabs selectedTabIndex={1} />,
        extras: [<NewRideButton key={'NewRideButton'} />],
      });
    }
});
