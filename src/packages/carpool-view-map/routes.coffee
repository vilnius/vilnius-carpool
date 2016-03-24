Router.map ()->
  @route 'Register', path: '/register'
  @route 'CarpoolLogin', path: '/login', controller: "CarpoolMapController"
  @route 'CarpoolMap', path: '/'
  @route 'CarpoolTrip', path: '/trip'

  # Mobile views
  @route 'ShowRide', path: '/showRide'
  @route 'Notifications', path: '/notifications'
