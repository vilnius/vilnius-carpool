###
  Most common test steps should be collected here
###
d = console.log.bind @, "---"
url = require('url');

# screenshots = "../docs/wireframe/0.1.15/";
screenshots = undefined;

module.exports = ()->
  @Before ->
    client.log "browser", (err, res)->
      for entry in res.value
        console.log ">>>", entry.message
      if err then console.log ">E>", err

    @TestHelper =
      screenShot: (name)->
        if screenshots?
          d "Make screenshot #{screenshots+name}"
          client.saveScreenshot(screenshots+name)

      logout: ()->
        client.url(url.resolve(process.env.ROOT_URL, "/logout"));
        client.waitForExist "[data-cucumber='login-screen']"

      # deprecated
      findLogout: ()->
        if client.isVisible(".navbar-toggle.collapsed")
          #d "Click menu toggle"
          client.click(".navbar-toggle.collapsed");
        client.waitForVisible('.showLogout');
        client.click(".showLogout");

      login: (username, password, path)->
        client.url(url.resolve(process.env.ROOT_URL, "/"));
        # Check user already logged in
        if client.isExisting(".profile_Name")
          user = server.call('getUser', username);
          d "Current user: #{client.getText(".profile_Name")}, wanted #{user.profile?.name}"
          if client.getText(".profile_Name") is user.profile?.name
            return
          else
            @findLogout();
            client.waitForVisible('.logout, .alert-error');
            if client.isVisible('.alert-error')
              expect(client.isVisible('.alert-error')).toBe(false, client.getText(".alert-error"));
            client.click(".logout");
        else
          client.waitForVisible('.join_Login', 5000);
          client.click '.join_Login'

        #console.log("Login with #{username} / #{password}")
        screenshot("uc2-login.png");
        client.waitForExist 'input[id="inputUsername"]'
        client.setValue('input[id="inputUsername"]', username);
        client.setValue('input[id="inputPassword"]', "aaa");
        client.click '.login'

        @findLogout();
        client.waitForVisible('.logout, .alert-error', 5000);

      urlLogin: (path, username, password)->
        this.logout();
        client.url(url.resolve(process.env.ROOT_URL, path));
        client.waitForExist 'input[id="inputUsername"]'
        client.setValue('input[id="inputUsername"]', username);
        client.setValue('input[id="inputPassword"]', "aaa");
        client.click '.login'
        client.waitForExist "[data-cucumber='add-trip-form']"
