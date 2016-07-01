// TODO deprecated - should move to your-tips/YourDriveScreen

export const name = 'carpool-view-flow';

import React from 'react';
import {mount} from 'react-mounter';

import {da} from 'meteor/spastai:logw'

import { MainLayout, SecureLayout } from './layout'
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
import RequestRideScreen from './react/your-trip/RequestRideScreen'
import ConfirmRideScreen from './react/your-trip/ConfirmRideScreen'
import YourDriveScreen from './react/your-trip/YourDriveScreen'
import NotificationsScreen from './react/notifications/NotificationsScreen'
import LocationAutocomplete from './react/location-autocomplete/LocationAutocomplete'
import FeedbackScreen from './react/feedback/FeedbackScreen'

import Chat from 'meteor/carpool-chat'

d = console.log.bind(console)

/* TODO Get rid of those variables
instead of caching these router scope variables stores some variables
*/
let aLoc, bLoc; // these variables travel through query parameters also
let addresses = {};

FlowRouter.route('/', {
  triggersEnter: [function(context, redirect) {
    if(undefined == Meteor.user()) {
      redirect("/login")
    } else {
      redirect('/m/all/offers');
    }
  }],
  action: function(params, queryParams) {
  }
});

FlowRouter.route('/login', {
    name: "Login",
    action: function(params, queryParams) {
      //console.log("Routing to - new trip form", TripFormScreen);
      mount(MainLayout, {
        content: <LoginScreen />,
      });
    }
});

FlowRouter.route('/logout', {
    name: "Logout",
    action: function(params, queryParams) {
      Meteor.logout(()=> FlowRouter.go("Login"));

    }
});

FlowRouter.route('/loginUsername', {
    name: "LoginUsername",
    action: function(params, queryParams) {
      //console.log("Routing to - new trip form", TripFormScreen);
      mount(MainLayout, {
        content: <LoginUsernameScreen />,
      });
    }
});

FlowRouter.route('/notifications', {
    name: "Notifications",
    action: function(params, queryParams) {
      //console.log("Routing to - new trip form", TripFormScreen);
      mount(SecureLayout, {
        topMenu: <TopMenu title="Notifications" />,
        content: <NotificationsScreen />,
        bottomMenu: <BottomTabs selectedTabIndex={3} />,
        renderFeedbackButton: true,
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
    mount(SecureLayout, {
      content: <LocationAutocomplete field={params.field} onSelect={(sugestion) => {
        location = googleServices.toLocation(sugestion.latlng);
        locStr = googleServices.encodePoints([location]);
        queryParams[params.field] = locStr;
        //d("Autocomplete was selected and query is", queryParams, sugestion, 'location', location)
        addresses[params.field] = sugestion.description;
        //console.log("Extending query", queryParams);
        FlowRouter.withReplaceState(() => {
          FlowRouter.go(params.screen, {}, queryParams)
        })
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
      //console.log("Fetching from/to from query", queryParams, "and variables", addresses);
      if(queryParams.aLoc) {
        aLoc = googleServices.decodePoints(queryParams.aLoc)[0];
      }
      if(queryParams.bLoc) {
        bLoc = googleServices.decodePoints(queryParams.bLoc)[0];
      }
      bTime = queryParams.bTime ? moment(queryParams.bTime, "YYYYMMDDTHHmm", true) : moment();
      //d("Router fetched values of Loc", aLoc, bLoc)
      mount(SecureLayout, {
        topMenu: <TopMenu title="New Trip" innerScreen />,
        content: <TripFormScreen from={aLoc} to={bLoc}
          fromAddress={addresses.aLoc} toAddress={addresses.bLoc} bTime={bTime}/>,
      });
    }
});

// Deprecated - move to YourDrive
FlowRouter.route('/rideConfirm/:id', {
  name: "RideConfirm",
  action: function(params, queryParams) {
    mount(SecureLayout, {
      topMenu: <TopMenu title="Ride confirmation" innerScreen />,
      content: <ConfirmRideScreen tripId={params.id}/>,
    });
  }
});

securedRoutes.route('/drive/:id', {
  name: "YourDrive",
  action: function(params, queryParams) {
    mount(SecureLayout, {
      topMenu: <TopMenu title="Your drive" innerScreen returnScreen="YourDrives" />,
      content: <YourDriveScreen tripId={params.id}/>,
    });
  }
});

securedRoutes.route('/ride/:id', {
 name: "YourRide",
 action: function(params, queryParams) {
   mount(SecureLayout, {
     topMenu: <TopMenu title="Your ride" innerScreen returnScreen="YourDrives" />,
     content: <RequestRideScreen tripId={params.id} rideId={queryParams.ride}/>,
   });
 }
});

securedRoutes.route('/feedback', {
   name: "Feedback",
   action: function(params, queryParams) {
     mount(SecureLayout, {
       topMenu: <TopMenu title="Feedback" innerScreen />,
       content: <FeedbackScreen />,
     });
   }
});

securedRoutes.route('/drives', {
 name: "YourDrives",
 action: function(params, queryParams) {
   mount(SecureLayout, {
     topMenu: <TopMenu title="My Trips" noShadow background="blue" />,
     topFilter: <TopTabs selectedTabIndex={1} />,
     content: <RideOffersScreen filterOwn="your" role="driver" />,
     bottomMenu: <BottomTabs selectedTabIndex={2} />,
     renderNewTripButton: true,
     renderFeedbackButton: true,
   })
 }
});

securedRoutes.route('/rides', {
 name: "YourRides",
 action: function(params, queryParams) {
   mount(SecureLayout, {
     topMenu: <TopMenu title="My Trips" noShadow background="blue" />,
     topFilter: <TopTabs selectedTabIndex={0} />,
     content: <RideOffersScreen filterOwn="your" role="rider" />,
     bottomMenu: <BottomTabs selectedTabIndex={2} />,
     renderNewTripButton: true,
     renderFeedbackButton: true,
   });
 }
});


FlowRouter.route('/m/all/requests', {
  name: "RideRequests",
  action: function(params, queryParams) {
    mount(SecureLayout, {
      topMenu: <TopMenu title="Ride requests" background="green" />,
      content: <RideOffersScreen role="rider"/>,
      bottomMenu: <BottomTabs selectedTabIndex={0} />,
      renderNewTripButton: true,
      renderFeedbackButton: true,
    });
  }
});

// This should be the last route as it takes optional parameter which could match all other routes
FlowRouter.route('/m/all/offers', {
    name: "RideOffers",
    action: function(params, queryParams) {
      if(queryParams.aLoc) {
        aLoc = googleServices.decodePoints(queryParams.aLoc)[0];
      }
      if(queryParams.bLoc) {
        bLoc = googleServices.decodePoints(queryParams.bLoc)[0];
      }
      bTime = queryParams.bTime ? moment(queryParams.bTime, "YYYYMMDDTHHmm", true) : moment();
      //console.log("Offers route", params, queryParams, "and aLoc:", aLoc);
      // by coincidence aLoc, bLoc and addresses are stored as global variables...
      mount(SecureLayout, {
        topMenu: <TopMenu title="Ride offers" hasTopTabs background="blue" />,
        topSearch: <TopSearch from={aLoc} to={bLoc} fromAddress={addresses.aLoc} toAddress={addresses.bLoc}
                      bTime={bTime} />,
        content: <RideOffersScreen aLoc={aLoc} bLoc={bLoc} />,
        bottomMenu: <BottomTabs selectedTabIndex={1} />,
        renderNewTripButton: true,
        renderFeedbackButton: true,
      });
    }
});

securedRoutes.route('/chat/:cdUser', {
    name: "Chat",
    action: function(params, queryParams) {
      //console.log("Routing to - new trip form", TripFormScreen);
      mount(SecureLayout, {
        topMenu: <TopMenu title="Chat" innerScreen />,
        content: <Chat cdUserId={params.cdUser}/>,
      });
    }
});
