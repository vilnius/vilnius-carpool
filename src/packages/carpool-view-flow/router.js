// TODO deprecated - should move to your-tips/YourDriveScreen
import React from 'react';
export const name = 'carpool-view-flow';

import {mount} from 'react-mounter';
import { MainLayout, SecureLayout } from './layout'
import {FlowHelpers} from './flowHelpers'
import BottomTabs from "./react/components/layout/BottomTabs"
import TopMenu from './react/components/layout/TopMenu'
import TopTabs from './react/components/layout/TopTabs'
import LoginScreen from './react/auth/Login'
import RegisterScreen from './react/auth/Register'
import LoginUsernameScreen from './react/auth/LoginUsername'
import RideOffersScreen from './react/containers/RideOffers'
import RidesListWithDataScreen from './react/containers/RidesListWithData.jsx';
import TripFormScreen from './react/containers/TripForm.jsx'
import DriveConfirmScreen from './react/containers/DriveConfirm.jsx';
import YourDriveScreen from './react/containers/YourDrive.jsx'
import YourRideScreen from './react/containers/YourRide.jsx';
import RequestRideScreen from './react/containers/RequestRide.jsx'
import NotificationsScreen from './react/screens/notifications/NotificationsScreen.jsx'
import LocationAutocomplete from './react/containers/LocationAutocomplete.jsx'
import FeedbackScreen from './react/screens/Feedback'
import About from './react/screens/About.jsx'
import Profile from './react/screens/Profile.jsx'
import NotificationSettings from './react/screens/NotificationSettings.jsx'
import moment from 'moment';

import Chat from 'meteor/carpool-chat'
/*global Meteor*/
/*global FlowRouter*/
/*global CarpoolService*/
/*global googleServices*/
/*global carpoolService*/


/* TODO Get rid of those variables
instead of caching these router scope variables stores some variables
*/
if(Meteor.settings.public.googleApi) {
  this.carpoolService = new CarpoolService({key: Meteor.settings.public.googleApi.key})
} else {
  this.carpoolService = new CarpoolService({});
  console.warn("Setup Google API key as described in https://github.com/vilnius/vilnius-carpool/wiki/Configuration-setup");
}


let aLoc, bLoc; // these variables travel through query parameters also
let addresses = {};

FlowRouter.route('/', {
  triggersEnter: [function(context, redirect) {
    if(undefined == Meteor.user()) {
      redirect("/login")
    } else {
      redirect('/newRide');
    }
  }],
  action: function() {
  }
});

FlowRouter.route('/about', {
  name: 'About',
  action: function() {
    mount(MainLayout, {
      navBar: {
        title: 'About',
        innerScreen: true,
      },
      topMenu: <TopMenu title="About" innerScreen />,
      content: <About />,
    })
  }
});

FlowRouter.route('/profile', {
  name: 'Profile',
  action: function() {
    mount(MainLayout, {
      navBar: {
        title: 'Profile',
        innerScreen: true,
      },
      topMenu: <TopMenu title="Profile" innerScreen />,
      content: <Profile />,
    })
  }
});

FlowRouter.route('/notificationSettings', {
  name: 'NotificationSettings',
  action: function() {
    mount(MainLayout, {
      navBar: {
        title: 'Notification settings',
        innerScreen: true,
      },
      topMenu: <TopMenu title="Notification settings" innerScreen />,
      content: <NotificationSettings />,
    })
  }
});

FlowRouter.route('/login', {
    name: "Login",
    action: function() {
      mount(MainLayout, {
        content: <LoginScreen />,
      });
    }
});

FlowRouter.route('/loginUsername', {
    name: "LoginUsername",
    action: function() {
      mount(MainLayout, {
        content: <LoginUsernameScreen />,
      });
    }
});

FlowRouter.route('/register', {
    name: "Register",
    action: function() {
      mount(MainLayout, {
        content: <RegisterScreen />,
      });
    }
});

FlowRouter.route('/logout', {
    name: "Logout",
    action: function() {
      Meteor.logout(()=> FlowRouter.go("Login"));

    }
});

FlowRouter.route('/notifications', {
    name: "Notifications",
    action: function() {
      mount(SecureLayout, {
        navBar: {
          title: 'Notifications',
        },
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
      }} />,
    });
  }
})

var securedRoutes = FlowRouter.group({
  prefix: '/m/your',
  name: 'your',
  triggersEnter: [function() {
    // console.log('Security check', userSubs.ready());
    // if(undefined == Meteor.user()) {
    //   redirect("/login")
    // }
  }]
});

securedRoutes.route('/newRide', {
    name: "NewRide",
    action: function() {
      mount(SecureLayout, {
        navBar: {
          title: 'New Trip',
          innerScreen: true,
        },
        topMenu: <TopMenu title="New Trip" innerScreen />,
        content: <TripFormScreen />,
        bottomMenu: <BottomTabs selectedTabIndex={1} />,
      });
    }
});

// Deprecated - move to YourDrive
FlowRouter.route('/user/ride/:id', {
  name: "RideConfirm",
  action: function(params, queryParams) {
    mount(SecureLayout, {
      navBar: {
        title: 'Ride confirmation',
        innerScreen: true,
      },
      topMenu: <TopMenu title="Ride confirmation" innerScreen />,
      content: <DriveConfirmScreen tripId={params.id} rideId={queryParams.ride} invitationId={queryParams.invitation} />
    });
  }
});

securedRoutes.route('/drive/:id', {
  name: "YourDrive",
  action: function(params) {
    mount(SecureLayout, {
      navBar: {
        title: 'Your drive',
        innerScreen: true,
        returnScreen: 'YourDrives',
      },
      topMenu: <TopMenu title="Your drive" innerScreen />,
      content: <YourDriveScreen tripId={params.id} />,
    });
  }
});

securedRoutes.route('/ride/:id', {
 name: "YourRide",
 action: function(params, queryParams) {
   //console.log("Your ride screen");
   mount(SecureLayout, {
     navBar: {
       title: 'Your ride',
       innerScreen: true,
       returnScreen: 'YourDrives',
     },
     topMenu: <TopMenu title="Your ride" innerScreen />,
     content: <YourRideScreen rideId={params.id} />,
   });
 }
});

securedRoutes.route('/trip/:id', {
 name: "RideRequest",
 action: function(params, queryParams) {
   mount(SecureLayout, {
     navBar: {
       title: 'Ride request',
       innerScreen: true,
       returnScreen: 'YourDrives',
     },
     topMenu: <TopMenu title="Ride request" innerScreen />,
     content: <RequestRideScreen tripId={params.id} rideId={queryParams.ride} />,
   });
 }
});


securedRoutes.route('/feedback', {
   name: "Feedback",
   action: function() {
     mount(SecureLayout, {
       navBar: {
         title: 'Feedback',
         innerScreen: true,
       },
       topMenu: <TopMenu title="Feedback" innerScreen />,
       content: <FeedbackScreen />,
     });
   }
});

securedRoutes.route('/drives', {
 name: "YourDrives",
 action: function() {
   mount(SecureLayout, {
     navBar: {
       title: 'My Trips',
     },
     topMenu: <TopMenu title="My Trips" noShadow background="blue" />,
     topFilter: <TopTabs selectedTabIndex={1} />,
     content: <RidesListWithDataScreen filterOwn="your" role="driver" />,
     bottomMenu: <BottomTabs selectedTabIndex={2} />,
     renderNewTripButton: true,
     renderFeedbackButton: true,
   })
 }
});

securedRoutes.route('/rides', {
 name: "YourRides",
 action: function() {
   mount(SecureLayout, {
     navBar: {
       title: 'My Trips',
     },
     topMenu: <TopMenu title="My Trips" noShadow background="blue" />,
     topFilter: <TopTabs selectedTabIndex={0} />,
     content: <RidesListWithDataScreen filterOwn="your" role="rider" />,
     bottomMenu: <BottomTabs selectedTabIndex={2} />,
     renderNewTripButton: true,
     renderFeedbackButton: true,
   });
 }
});


FlowRouter.route('/m/all/requests', {
  name: "RideRequests",
  action: function() {
    mount(SecureLayout, {
      navBar: {
        title: 'Ride requests',
        background: 'green',
      },
      topMenu: <TopMenu title="Ride requests" background="green" />,
      content: <RidesListWithDataScreen role="rider" />,
      bottomMenu: <BottomTabs selectedTabIndex={0} />,
      renderNewTripButton: true,
      renderFeedbackButton: true,
    });
  }
});

// Tracker.autorun(function () {
//   d("Check aLoc", aLoc, Session.get("geoIpLoc"));
//   if(undefined === aLoc && Session.get("geoIpLoc")) {
//     aLoc = Session.get("geoIpLoc");
//     if (FlowRouter.current().route) {
//       let {route: {name : currentPath}} = FlowRouter.current()
//       d("Use current user location to append "+currentPath, aLoc);
//       carpoolService.encodePoints([aLoc], (location)=> {
//         d("Updating url with goeIpLoc", location);
//         FlowHelpers.goExtendedQuery(undefined, {}, {aLoc: location});
//       });
//     }
//   }
// });

// This should be the last route as it takes optional parameter which could match all other routes
FlowRouter.route('/m/all/offers', {
    name: "RideOffers",
    action: function(params, queryParams) {
      //d("RideOffers aLoc="+queryParams.aLoc+";")
      if(undefined == queryParams.aLoc) {
        carpoolService.currentLocation((err, aLoc)=> {
          if(err) return console.warn("Error getting current location:", err);
          // let {route: {name : currentPath}, queryParams} = FlowRouter.current();
          if(!queryParams.aLoc) {
            //d("Use current user location to append ", aLoc);
            carpoolService.encodePoints([aLoc], (location)=> {
              //d("Updating url with goeIpLoc", location);
              FlowHelpers.goExtendedQuery(undefined, {}, {aLoc: location});
            });
          }
        });
      } else {
        aLoc = googleServices.decodePoints(queryParams.aLoc)[0];
      }
      if(queryParams.bLoc) {
        bLoc = googleServices.decodePoints(queryParams.bLoc)[0];
      }
      let bTime = queryParams.bTime ? moment(queryParams.bTime, "YYYYMMDDTHHmm", true) : undefined;
      //console.log("Offers route", params, queryParams, "and aLoc:", aLoc);
      // by coincidence aLoc, bLoc and addresses are stored as global variables...
      mount(SecureLayout, {
        navBar: {
          title: 'Ride Offers',
        },
        topMenu: <TopMenu title="Ride offers" hasTopTabs background="blue" />,
        // topSearch: <TopSearch from={aLoc} to={bLoc} fromAddress={addresses.aLoc} toAddress={addresses.bLoc} bTime={bTime} />,
        content: <RideOffersScreen aLoc={aLoc} bLoc={bLoc} bTime={bTime} />,
        bottomMenu: <BottomTabs selectedTabIndex={1} />,
        renderNewTripButton: true,
        renderFeedbackButton: true,
      });
    }
});

securedRoutes.route('/chat/:cdUser', {
    name: "Chat",
    action: function(params) {
      mount(SecureLayout, {
        navBar: {
          title: 'Chat',
          innerScreen: true,
        },
        topMenu: <TopMenu title="Chat" innerScreen />,
        content: <Chat cdUserId={params.cdUser} />,
      });
    }
});
