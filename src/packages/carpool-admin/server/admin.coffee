Meteor.methods
  createAccount: (values)->
    user = Meteor.users.findOne(@userId);
    if not security.isAdmin(user)
      throw new Meteor.Error("pants-not-found", "Can't find my pants")
    Accounts.createUser values
  updateAccount: (values)->
    user = Meteor.users.findOne(@userId);
    if not security.isAdmin(user)
      throw new Meteor.Error("pants-not-found", "Can't find my pants")
    userId = values._id
    d "Updating account #{userId}", values
    if values.username then Accounts.setUsername(userId, values.username)
    if values.email then Accounts.addEmail(userId, values.email)
    if values.password then Accounts.setPassword(userId, values.password)
    if values.roles
      Meteor.users.update(_id: userId, {$set: {"roles": values.roles}});
  deleteAccount: (_id)->
    user = Meteor.users.findOne(@userId);
    if not security.isAdmin(user)
      throw new Meteor.Error("pants-not-found", "Can't find my pants")
    d "Removing account #{_id} as #{@userId}"
    Meteor.users.remove({_id:_id})
