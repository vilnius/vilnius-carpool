Router.map ()->
  @route 'Register', path: '/register'
  @route 'CarpoolLogin', path: '/map/login', controller: "CarpoolMapController"
  @route 'CarpoolMap', path: '/map'
  @route 'CarpoolTrip', path: '/map/trip'

  # Mobile views
  @route 'ShowRide', path: '/map/showRide'
  @route 'ShowDrive', path: '/map/showDrive'
  @route 'ShowPickup', path: '/map/showPickup'
  @route 'Notifications', path: '/map/notifications'
