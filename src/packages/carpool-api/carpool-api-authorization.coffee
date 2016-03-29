@apiSecurity = new ApiSecurity

Router.route('/api/access_token', where: 'server').get(->
  username = @params.query.username
  digest = @params.query.digest
  password = @params.query.password

  headers =
    'Content-type': 'application/json; charset=utf-8'

  result = apiSecurity.authenticate(username, password);
  if result.error
    da ["carpool-api"], "Authentication #{username} result", result
    @response.writeHead(result.error, headers);
    @response.end(JSON.stringify(result), "utf-8");
  else
    @response.writeHead(200, headers);
    @response.end(JSON.stringify(result), "utf-8");
);
