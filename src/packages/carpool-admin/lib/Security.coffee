
class Security
  isAdmin: (user)->
    _(user?.roles).contains('root')

  isAuthenticated: ->
    return Meteor.userId()

@security = new Security
