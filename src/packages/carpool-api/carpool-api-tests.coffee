###
  fixtures
###
username = "user1@tiktai.lt"
user = Meteor.users.findOne($or: [{username: username},{"emails.address" : username}]);
if user
  userId = user._id
else
  userId = Accounts.createUser
    username: username
    password: "aaa"

id = Locations.insert {
  tsi: new Date()
  userId: userId
  loc: [  25.272159576416016,  54.69387649850695 ]
}

Meteor.users.remove {"emails.address": "user3@tiktai.lt"}

#d "Location inserted for #{userId}", id

Tinytest.addAsync "API - get protected resource", (test, onComplete)->
  #d "Test fn:", _(test).functions();
  HTTP.call "GET", Meteor.absoluteUrl('/api/access_token'), {
    params:
      username: "user1@tiktai.lt"
      password: "aaa"
  }, (error, result) ->
    #d "Authentication result:", result, error
    test.isNull(error)
    test.isUndefined(result.data.error);
    token = result.data.token
    test.isNotNull(token)
    HTTP.call "GET", Meteor.absoluteUrl("/api/user/#{result.data.id}/location"), {
      params:
        access_token: token
    }, (error, result) ->
      #d "Got response", result
      test.isNull(error)
      test.isUndefined(result.data.error);
      onComplete();

Tinytest.addAsync "API - register user", (test, onComplete)->
  HTTP.call "POST", Meteor.absoluteUrl('/api/account'), {
    params:
      username: "user3@tiktai.lt"
      password: "aaa"
      name: "RegistrationTest"
  }, (error, result) ->
    #console.log("Register user result:", result, error)
    test.isNull(error)
    test.isUndefined(result.data?.error);
    onComplete();
