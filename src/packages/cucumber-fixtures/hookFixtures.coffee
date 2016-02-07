Meteor.methods
  removeUsers: () ->
    console.log '---', "Cleanup users"
    Meteor.users.remove {}

  removeUser: (email) ->
    console.log '---', "Remove user"
    Meteor.users.remove {"emails.address": email}

  assureUser: (opts) ->
    console.log '---', "Create users", opts
    try
      Accounts.createUser
        email: opts.email
        password: if opts.password then opts.password else 'aaa'
    catch err
      console.log '---', "Ignore", err

  removeTrips: (email) ->
    user = Meteor.users.findOne "emails.address": email
    console.log '---', "Remove trips for", user
    Trips.remove owner: user._id
