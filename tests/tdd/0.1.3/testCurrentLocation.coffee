helper = new (require '../../actions').Helper()

#http://stackoverflow.com/questions/15894090/does-phantomjs-support-geolocations
describe 'Opening browser', ->
  it 'should set current location, but phanthom js doesn't provide ', (done, server, cB) ->
    cB.eval ()->
       Router.go "/"
       waitForDOM '#streets_map_canvas', () ->
        Deps.autorun ->
          latlng = trip.getFromLatLng();
          da ['long-trips'], "From latlng changed:", latlng
        #emit 'done'
    cB.once 'done', ->
      done();