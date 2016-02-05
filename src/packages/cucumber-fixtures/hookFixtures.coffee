Meteor.methods
  removeUsers: () ->
    console.log '---', "Cleanup users"
    Meteor.users.remove {}

  removeUser: (email) ->
    console.log '---', "Remove user"
    Meteor.users.remove {"emails.address": email}

  addUser: (opts) ->
    console.log '---', "Create users", opts
    Accounts.createUser
      email: opts.email
      password: if opts.password then opts.password else 'aaa'

  removeTrips: (email) ->
    console.log '---', "Remove trips for #{user}"
    user = Meteor.users.find "emails.address": email 
    Trips.remove owner: user._id
