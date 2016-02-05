helper = new (require '../actions').Helper()

describe 'Post to ifttt url', ->
  it 'should send email with from latlng and poster email', (done, server, cB) ->
    cB.eval helper.createABUsers
    cB.once 'usersCreated', ->
      cB.eval helper.createTripOneAsB  
      cB.eval helper.createTripTwoAsB
    cB.once 'tripTwoCreated', ->  
      cB.eval ()->
        emailBody =
          """I exited an area
          February 07, 2014 at 11:58AM
          via iOS Location http://ift.tt/1bBtoDs
          """
        d "Posting to localhost/ifttt", emailBody
        #HTTP.call "POST", "http://localhost:80/ifttt", {data: 
        HTTP.call "POST", "/ifttt", {data:
          {'body-plain': emailBody, sender:'b@b.com'}
        }, (error, result) -> 
          if (!error)
            d "Got result:", result
            #emit "done"
          else 
            d 'Error', e
    cB.once 'done', ->
      done();
  