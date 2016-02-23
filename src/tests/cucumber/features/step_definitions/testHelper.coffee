d = console.log.bind @, "---"
url = require('url');

module.exports = ()->
  @Before ->
    client.log "browser", (err, res)->
      for entry in res.value
        console.log ">>>", entry.message
      if err then console.log ">E>", err

    @TestHelper =
      login: (username, password, path)->
        client.url(url.resolve(process.env.ROOT_URL, "/"));

        # Check user already logged in
        if client.isExisting(".profile_Name")
          d "Current user: #{client.getText(".profile_Name")}, wanted #{username}"
          if client.getText(".profile_Name") is username
            return
          else
            client.click(".showLogout");
            client.waitForVisible('.logout');
            client.click(".logout");
        else
          client.waitForVisible('.join_Login');
          client.click '.join_Login'

        #console.log("Login with #{username} / #{password}")
        client.waitForExist 'input[id="inputUsername"]'
        client.setValue('input[id="inputUsername"]', username);
        client.setValue('input[id="inputPassword"]', "aaa");

        client.click '.login'
        client.waitForExist('.logout');
