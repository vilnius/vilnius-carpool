export const name = 'carpool-view-flow';

import React from 'react';
import {mount} from 'react-mounter';

import {LandingLayout, PlainLayout, NotificationLayout} from './layout'
import {FlowHelpers} from './flowHelpers'
import BottomTabs from "./react/layout/BottomTabs"
import NewRideButton from './react/layout/NewRideButton'
import TopMenu from './react/layout/TopMenu'
import TopTabs from './react/layout/TopTabs'
import TopSearch from './react/layout/TopSearch'

import RidesList from './react/components/RidesList'

import LoginScreen from './react/auth/Login'
import LoginUsernameScreen from './react/auth/LoginUsername'
import RideOffersScreen from './react/ride-list/RideOffersScreen'
import TripFormScreen from './react/trip-form/TripForm'
import RequestRideScreen from './react/request-ride/RequestRideScreen'
import ConfirmRideScreen from './react/confirm-ride/ConfirmRideScreen'
import NotificationsScreen from './react/notifications/NotificationsScreen'
import LocationAutocomplete from './react/location-autocomplete/LocationAutocomplete'

/* TODO Get rid of those variables
instead of caching these router scope variables stores some variables
*/
let aLoc, bLoc; // these variables travel through query parameters also
let addresses = {};

FlowRouter.route('/rideRequest/:id', {
  name: "RideRequest",
  action: function(params, queryParams) {
    mount(PlainLayout, {
      topMenu: <TopMenu title="Ride requests" innerScreen />,
      content: <RequestRideScreen tripId={params.id}/>,
    });
  }
});

FlowRouter.route('/rideConfirm/:id', {
  name: "RideConfirm",
  action: function(params, queryParams) {
    mount(PlainLayout, {
      topMenu: <TopMenu title="Ride confirmation" innerScreen />,
      content: <ConfirmRideScreen tripId={params.id}/>,
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

FlowRouter.route('/notifications', {
    name: "Notifications",
    action: function(params, queryParams) {
      //console.log("Routing to - new trip form", TripFormScreen);
      mount(NotificationLayout, {
        topMenu: <TopMenu title="Notifications" />,
        content: <NotificationsScreen />,
        bottomMenu: <BottomTabs selectedTabIndex={3} />,
      });
    }
});
/*
This coponent takes <field> as url parameter. This paramter is used onSelect -
queryParams are appened with this field name with coordination value got from suggestions.
locationAutocomplete/RideOffers/aLoc when finished routes to /RideOffers?aLoc=xxx
Important to note that other query params are preserved
*/
FlowRouter.route('/locationAutocomplete/:screen/:field', {
  name: 'LocationAutocomplete',
  action: function(params, queryParams) {
    mount(PlainLayout, {
      content: <LocationAutocomplete onSelect={(sugestion) => {
        location = googleServices.toLocation(sugestion.latlng);
        locStr = googleServices.encodePoints([location]);
        queryParams[params.field] = locStr;
        addresses[params.field] = sugestion.description;
        //console.log("Extending query", queryParams);
        FlowRouter.go(params.screen, {}, queryParams)
      }}/>,
    });
  }
})

var securedRoutes = FlowRouter.group({
  prefix: '/m/your',
  name: 'your',
  triggersEnter: [function(context, redirect) {
    // console.log('Security check', userSubs.ready());
    // if(undefined == Meteor.user()) {
    //   redirect("/login")
    // }
  }]
});

securedRoutes.route('/newRide', {
    name: "NewRide",
    action: function(params, queryParams) {
      console.log("Fetching from/to from query", queryParams, "and variables", addresses);
      if(queryParams.aLoc) {
        aLoc = googleServices.decodePoints(queryParams.aLoc)[0];
      }
      if(queryParams.bLoc) {
        bLoc = googleServices.decodePoints(queryParams.bLoc)[0];
      }
      mount(PlainLayout, {
        topMenu: <TopMenu title="New Trip" innerScreen />,
        content: <TripFormScreen from={aLoc} to={bLoc}
          fromAddress={addresses.aLoc} toAddress={addresses.bLoc}/>,
      });
    }
});

securedRoutes.route('/:tripType?', {
  name: "MyTrips",
  action: function(params, queryParams) {
    mount(LandingLayout, {
      topMenu: <TopMenu title="My Trips" hasTopTabs background="blue" />,
      topFilter: <TopTabs selectedTabIndex={params.tripType === 'drives'? 1 : 0} />,
      content: <RideOffersScreen filterOwn="your" role={'drives' === params.tripType ? "driver" : "rider" } />,
      bottomMenu: <BottomTabs selectedTabIndex={2} />,
      extras: [<NewRideButton key="NewRideButton" />],
    });
  }
});

FlowRouter.route('/m/all/requests', {
  name: "RideRequests",
  action: function(params, queryParams) {
    mount(LandingLayout, {
      topMenu: <TopMenu title="Ride requests" background="green" />,
      content: <RideOffersScreen role="rider"/>,
      bottomMenu: <BottomTabs selectedTabIndex={0} />,
      extras: [<NewRideButton key={'NewRideButton'} />],
    });
  }
});

// This should be the last route as it takes optional parameter which could match all other routes
FlowRouter.route('/m/all/offers', {
    name: "RideOffers",
    action: function(params, queryParams) {
      //console.log("Routing to - root", params.ownTrips === "your");
      if(queryParams.aLoc) {
        aLoc = googleServices.decodePoints(queryParams.aLoc)[0];
      }
      if(queryParams.bLoc) {
        bLoc = googleServices.decodePoints(queryParams.bLoc)[0];
      }

      // by coincidence aLoc, bLoc and addresses are stored as global variables...
      mount(LandingLayout, {
        topMenu: <TopMenu title="Ride offers" hasTopTabs background="blue" />,
        topSearch: <TopSearch from={aLoc} to={bLoc} fromAddress={addresses.aLoc} toAddress={addresses.bLoc} />,
        content: <RideOffersScreen />,
        bottomMenu: <BottomTabs selectedTabIndex={1} />,
        extras: [<NewRideButton key={'NewRideButton'} />],
      });
    }
});

FlowRouter.route('/', {
  triggersEnter: [function(context, redirect) {
    console.log("Route user", Meteor.user())
    if(undefined == Meteor.user()) {
      redirect("/login")
    } else {
      redirect('/m/all/offers');
    }
  }],
  action: function(params, queryParams) {
  }
});
