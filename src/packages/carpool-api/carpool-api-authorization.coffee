@apiSecurity = new ApiSecurity

errorWrapper = (fn)->
  headers =
    'Content-type': 'application/json; charset=utf-8'
  try
    #da ["carpool-api"], "Wrapping function", arguments
    result = fn.apply(this, arguments);
    @response.writeHead(200, headers);
    @response.end(JSON.stringify(result), "utf-8");
  catch e
    console.error(e)
    errorCode = 503
    if e.error
      errorCode = e.error
    @response.writeHead(errorCode, headers);
    @response.end("error:"+JSON.stringify(e), "utf-8");

register =

Router.route('/api/account', where: 'server').post(_.wrap(( ->
  d "/api/account POST:", @request.body
  id = apiSecurity.register(@request.body.username, @request.body.password, @request.body.name)
  return {userId: id}
), errorWrapper));

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
