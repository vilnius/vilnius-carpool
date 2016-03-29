Router.map ()->
  @route 'Register', path: '/register'
  @route 'CarpoolLogin', path: '/login', controller: "CarpoolMapController"
  @route 'CarpoolMap', path: '/'
  @route 'CarpoolTrip', path: '/trip'

  # Mobile views
  @route 'ShowRide', path: '/showRide'
  @route 'ShowDrive', path: '/showDrive'
  @route 'ShowPickup', path: '/showPickup'
  @route 'Notifications', path: '/notifications'
