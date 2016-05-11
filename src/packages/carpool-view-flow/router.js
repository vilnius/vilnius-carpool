export const name = 'carpool-view-flow';

import React from 'react';
import {mount} from 'react-mounter';
import {MainLayout} from './layout'
import BottomTabs from "./react/layout/BottomTabs"


FlowRouter.route('/:ownTrips?', {
    name: "RideOffers",
    action: function(params, queryParams) {
      console.log("Yeah! We are on root.");
      mount(MainLayout, {
        topMenu: <OffersMenu />,
        topFilter: <AllYourFilter />,
        content: <RideList name="Arunoda" />,
        bottomMenu: <BottomTabs />,
      });
    }
});

FlowRouter.route('/requests/:ownTrips?', {
  name: "Requests",
  action: function(params, queryParams) {
    console.log("Yeah! We are on root.");
    mount(MainLayout, {
      topMenu: <RequestsMenu />,
      topFilter: <AllYourFilter />,
      content: <RideList name="Arunoda" />,
      bottomMenu: <BottomTabs />,
    });
  }
});
