Router.map ()->
  @route 'MuiLanding', path: '/mui/'

  @route 'MuiRegister', path: '/mui/register'
  @route 'MuiLogin', path: '/mui/login', controller: "CarpoolMapController"
  @route 'MuiEditTrip', path: '/mui/trip'

  # Mobile views
  @route 'MuiShowRide', path: '/mui/showRide'
  @route 'MuiShowDrive', path: '/mui/showDrive'
  @route 'MuiShowPickup', path: '/mui/showPickup'
  @route 'MuiNotifications', path: '/mui/notifications'
