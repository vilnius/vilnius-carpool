export const name = 'carpool-view-flow';

import React from 'react';
import {mount} from 'react-mounter';
import {LandingLayout} from './layout'
import BottomTabs from "./react/layout/BottomTabs"

import RideOffersScreen from './react/ride-offers/RideOffersScreen'

FlowRouter.route('/requests/:ownTrips?', {
  name: "Requests",
  action: function(params, queryParams) {
    console.log("Yeah! We are on requests");
    mount(LandingLayout, {
      topMenu: <RequestsMenu />,
      topFilter: <AllYourFilter />,
      content: <RideList name="Arunoda" />,
      bottomMenu: <BottomTabs />,
    });
  }
});

FlowRouter.route('/:ownTrips?', {
    name: "RideOffers",
    action: function(params, queryParams) {
      console.log("Yeah! We are on root.");
      mount(LandingLayout, {
        topMenu: <OffersMenu />,
        topFilter: <AllYourFilter />,
        content: <RideOffersScreen/>,
        bottomMenu: <BottomTabs />,
      });
    }
});
