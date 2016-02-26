Template.Register.events
  # TODO dry register and login
  "click .register": (event, template) ->
    name = template.find("#userName").value
    email = template.find("#userEmail").value
    password = template.find("#userPassword").value
    return Session.set("registrationError", "Name" + " should not be empty")  unless Match.test(name, NonEmptyString)
    return Session.set("registrationError", "Email" + " should not be empty")  unless Match.test(email, NonEmptyString)
    return Session.set("registrationError", "Password" + " should not be empty")  unless Match.test(password, NonEmptyString)
    d "Registering:", email
    user =
      email: email
      password: password
      profile:
        name: name
    Accounts.createUser user, (error) ->
      d "Registration of user " + email, error
      unless error
        Router.go Session.get("workflow") or "CarpoolMap"
        Session.set "registrationError", ""
      else
        Session.set "registrationError", error.reason
