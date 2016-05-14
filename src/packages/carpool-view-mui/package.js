Package.describe({
  name: 'carpool-view-mui',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3');
  api.use('ecmascript');
  api.use(['underscore', 'coffeescript']);
  api.use('momentjs:moment','client');

  //api.use('tap:i18n', ['client', 'server']);
  //api.addFiles("package-tap.i18n", ["client", "server"]);

  api.use(['templating', 'tracker'], 'client');
  api.use('react');
  api.use('react-template-helper');
  api.use('iron:router','client');

  api.use("spastai:carpool-service");
  api.use("spastai:google-client@0.0.12", 'client');
  api.use("carpool-notifications");

  api.addFiles('controller.coffee', "client");

  api.addFiles('components/trip-form/TripForm.jsx', "client");
  api.addFiles('components/landing/Landing.jsx', "client");
  api.addFiles('components/trip/DriverTrip.jsx', "client");
  api.addFiles('components/trip/PassengerTrip.jsx', "client");
  api.addFiles('components/notifications/Notifications.jsx', "client");
  api.addFiles('components/auth/Login.jsx', "client");
  api.addFiles('components/auth/Register.jsx', "client");
  api.addFiles('react/logged-in-landing/LoggedInLandingScreen.jsx', "client");
  api.addFiles('react/not-logged-in-landing/NotLoggedInLandingScreen.jsx', "client");
  api.addFiles('react/new-ride-offer/NewRideOfferScreen.jsx', "client");
  api.addFiles('react/ride-offers/RideOffersScreen.jsx', "client");
  api.addFiles('react/request-ride/RequestRideScreen.jsx', "client");
  api.addFiles('react/requests/RequestsScreen.jsx', "client");
  api.addFiles('react/notifications/NotificationsScreen.jsx', "client");
  api.addFiles('react/about/AboutScreen.jsx', "client");
  api.addFiles('react/notification-settings/NotificationSettingsScreen.jsx', "client");
  api.addFiles('react/profile/ProfileScreen.jsx', "client");

  api.addFiles(['views/MuiLanding.html', 'views/MuiLanding.coffee'], "client");
  api.addFiles(['views/MuiEditTrip.html', 'views/MuiEditTrip.coffee'], "client");
  api.addFiles(['views/MuiDriverTrip.html', 'views/MuiDriverTrip.coffee'], "client");
  api.addFiles(['views/MuiPassengerTrip.html', 'views/MuiPassengerTrip.coffee'], "client");
  api.addFiles(['views/MuiNotifications.html', 'views/MuiNotifications.coffee'], "client");
  api.addFiles(['views/MuiLogin.html', 'views/MuiLogin.coffee'], "client");
  api.addFiles(['views/MuiRegister.html', 'views/MuiRegister.coffee'], "client");
  api.addFiles(['views/LoggedInLanding.html', 'views/LoggedInLanding.coffee'], "client");
  api.addFiles(['views/NotLoggedInLanding.html', 'views/NotLoggedInLanding.coffee'], "client");
  api.addFiles(['views/NewRideOffer.html', 'views/NewRideOffer.coffee'], "client");
  api.addFiles(['views/RideOffers.html', 'views/RideOffers.coffee'], "client");
  api.addFiles(['views/Notifications.html', 'views/Notifications.coffee'], "client");
  api.addFiles(['views/Requests.html', 'views/Requests.coffee'], "client");
  api.addFiles(['views/About.html', 'views/About.coffee'], "client");
  api.addFiles(['views/NotificationSettings.html', 'views/NotificationSettings.coffee'], "client");
  api.addFiles(['views/Profile.html', 'views/Profile.coffee'], "client");

  api.addFiles(['views/RequestRide.html', 'views/RequestRide.coffee'], "client");

  api.addFiles('views/styles.css', "client");

  api.mainModule('routes.coffee', "client");
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('carpool-view-mui');
  api.mainModule('tests/carpool-view-mui-tests.js');
});
