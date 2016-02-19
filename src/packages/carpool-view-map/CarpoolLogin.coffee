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
