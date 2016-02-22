Template.profilePanel.events
  'click .accordion': (event, template) ->
  'click .register': (event, template) ->
    name = template.find('#userName').value
    email = template.find('#userEmail').value
    password = template.find('#userPassword').value
    if !Match.test(name, NonEmptyString)
      return Session.set('registrationError', 'Name' + ' should not be empty')
    if !Match.test(email, NonEmptyString)
      return Session.set('registrationError', 'Email' + ' should not be empty')
    if !Match.test(password, NonEmptyString)
      return Session.set('registrationError', 'Password' + ' should not be empty')
    d 'Registering:', email
    Accounts.createUser {
      email: email
      password: password
      profile: name: name
    }, (error) ->
      d 'Registration of user ' + email, error
      if !error
        Router.go Session.get('workflow') or mapWorkflow.start.page
        Session.set 'registrationError', ''
      else
        Session.set 'registrationError', error.reason
      return
    return
  'click .login': (event, template) ->
    user = template.find('#inputUsername').value
    password = template.find('#inputPassword').value
    d 'Login user ' + user, [ 'login-error' ]
    Meteor.loginWithPassword user, password, (error) ->
      if error
        d 'Log in ' + user + '  error: ' + error.reason
        Session.set 'loginError', error.reason
      else
        #d("Logged in");
        Router.go Session.get('workflow') or 'Map'
        Session.set 'loginError', ''
      return
    return
  'click .facebookLogin': (event, template) ->
    Meteor.loginWithFacebook (error) ->
      if error
        d 'Log in with facebook error: ', error
      else
        nextPage = Session.get('workflow') or 'Map'
        d 'Login with facebook succesful, redirecting:' + nextPage
        Router.go nextPage
      return
    return
  'click .logout': (event, template) ->
    da [ 'viewport-map' ], 'Do logout and go to first page'
    Meteor.logout()
    #da(['group-security'], "Go to MainLogin");
    Router.go 'Welcome'
    return
