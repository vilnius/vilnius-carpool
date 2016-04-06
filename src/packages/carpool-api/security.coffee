class @ApiSecurity
  register: (email, password, name)->
    user =
      email: email
      password: password
      profile:
        name: name
    da ["carpool-api"], "Creating user:", user        
    Accounts.createUser(user);

  authenticate: (username, password)->
    user = Meteor.users.findOne($or: [{username: username},{"emails.address" : username}]);
    da ["carpool-api"], "Authenticate #{username}", user
    if not user?
      return {
        error: 404
        reason: "User not found",
        message: "User not found [404]"
      }
    digest = Package.sha.SHA256(password);
    authenticationResult = Accounts._checkPassword(user, {digest: digest, algorithm: 'sha-256'};);
    if authenticationResult.error
      return authenticationResult.error

    userId = user._id;
    #creating the token and adding to the user
    stampedToken = Accounts._generateStampedLoginToken();
    #hashing is something added with Meteor 0.7.x,
    #you don't need to do hashing in previous versions
    hashStampedToken = Accounts._hashStampedToken(stampedToken);

    da ["carpool-api"], "Saving token #{userId}", hashStampedToken
    Meteor.users.update(userId,
      {$push: {'services.resume.loginTokens': hashStampedToken}}
    );
    result =
      id: userId,
      token: stampedToken.token

  authorize: (userId, access_token)->
    hashStampedToken = Accounts._hashStampedToken({token: access_token});
    da ["carpool-api"], "Authorize #{userId}, #{access_token}", hashStampedToken
    user = Meteor.users.findOne {_id: userId, 'services.resume.loginTokens.hashedToken': hashStampedToken.hashedToken}
