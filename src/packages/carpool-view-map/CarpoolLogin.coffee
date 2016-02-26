Template.CarpoolLogin.rendered = ->


Template.CarpoolLogin.events
  "click .login": (event, template) ->
    user = template.find("#inputUsername").value
    password = template.find("#inputPassword").value
    Meteor.loginWithPassword user, password, (error) ->
      if error
        d "Log in " + user + "  error: " + error.reason
        Session.set "loginError", error.reason
      else
        #d("Logged in");
        Router.go Session.get("workflow") or "CarpoolMap"
        Session.set "loginError", ""
        
  "click .facebookLogin": (event, template) ->
    Meteor.loginWithFacebook (error) ->
      if error
        d "Log in with facebook error: ", error
      else
        nextPage = Session.get("workflow") or "CarpoolMap"
        d "Login with facebook succesful, redirecting:" + nextPage
        Router.go nextPage
