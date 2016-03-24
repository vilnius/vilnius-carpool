Router.map ()->
  @route 'Register', path: '/register'
  @route 'CarpoolLogin', path: '/login', controller: "CarpoolMapController"
  @route 'CarpoolMap', path: '/'
  @route 'CarpoolTrip', path: '/trip'

  # Mobile views
  @route 'ShowRide', path: '/showRide'
  @route 'ShowDrive', path: '/showDrive'
  @route 'Notifications', path: '/notifications'
