export const name = 'carpool-view-flow';

import React from 'react';
import {mount} from 'react-mounter';
import {LandingLayout} from './layout'
import BottomTabs from "./react/layout/BottomTabs"
import NewRideButton from './react/layout/NewRideButton'
import RidesList from './react/components/RidesList'
import TopMenu from './react/layout/TopMenu'
import TopTabs from './react/layout/TopTabs'

import RideOffersScreen from './react/ride-offers/RideOffersScreen'

function getRandomBool() {
  return Math.random() < 0.5
}

const ridesExample = [
  {
    name: 'TestName',
    image: 'http://lorempixel.com/200/200/people/1',
    isReccuring: getRandomBool(),
    reccuringDays: [getRandomBool(), getRandomBool(), getRandomBool(),
      getRandomBool(), getRandomBool(), getRandomBool(), getRandomBool()],
    date: `May ${Math.round(Math.random() * 30)}, 2016`,
    from: 'Gatves g. 12',
    fromTime: '8:35',
    to: 'Prospekto pr. 57',
    toTime: '9:15',
    toTimeApproximate: true,
  }
]

FlowRouter.route('/requests/:ownTrips?', {
  name: "Requests",
  action: function(params, queryParams) {
    console.log("Yeah! We are on requests");
    mount(LandingLayout, {
      topMenu: <TopMenu title="Ride requests" hasTopTabs />,
      topFilter: <TopTabs selectedTabIndex={0}
                  tabs={[{
                    title: 'All',
                    onClick: () => {console.log('Clicked on All')}
                  }, {
                    title: 'Yours',
                    onClick: () => {console.log('Clicked on Yours')}
                  }]}
                 />,
      content: <RidesList rides={ridesExample} />,
      bottomMenu: <BottomTabs selectedTabIndex={0} />,
      extras: [<NewRideButton key={'NewRideButton'} />],
    });
  }
});

FlowRouter.route('/:ownTrips?', {
    name: "RideOffers",
    action: function(params, queryParams) {
      console.log("Yeah! We are on root.");
      mount(LandingLayout, {
        topMenu: <TopMenu title="Ride offers" hasTopTabs />,
        topFilter: <TopTabs selectedTabIndex={1}
                    tabs={[{
                      title: 'All',
                      onClick: () => {console.log('Clicked on All')}
                    }, {
                      title: 'Yours',
                      onClick: () => {console.log('Clicked on Yours')}
                    }]}
                   />,
        content: <RideOffersScreen/>,
        bottomMenu: <BottomTabs selectedTabIndex={1} />,
        extras: [<NewRideButton key={'NewRideButton'} />],
      });
    }
});