Router.map ()->
  @route 'MuiLanding', path: '/mui/'

  @route 'MuiRegister', path: '/mui/register'
  @route 'MuiLogin', path: '/mui/login'
  # @route 'MuiLogin', path: '/mui/login', controller: "CarpoolMapController"
  @route 'MuiEditTrip', path: '/mui/trip'
  @route 'MuiDriverTrip', path: '/mui/driverTrip'
  @route 'MuiPassengerTrip', path: '/mui/passengerTrip'
  @route 'MuiNotifications', path: '/mui/notifications'
  @route 'NotLoggedInLanding', path:'/mui/screen1'
  @route 'LoggedInLanding', path: 'mui/screen2'
  @route 'RideOfferDetails', path: 'mui/screen3'
  @route 'RideOffers', path: 'mui/screen4'
  @route 'NewRideOffer', path: 'mui/screen5'

  # Mobile views
  # @route 'MuiShowRide', path: '/mui/showRide'
  # @route 'MuiShowDrive', path: '/mui/showDrive'
  # @route 'MuiShowPickup', path: '/mui/showPickup'
  # @route 'MuiNotifications', path: '/mui/notifications'
