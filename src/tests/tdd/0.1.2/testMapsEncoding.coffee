describe 'Encode decode coords', ->
  it 'should give same result', (done, server) ->
    server.eval ->
      fromLoc = [25.312986840220695, 54.68497543662714]
      toLoc = [25.284004099999947, 54.6713496]
      encoded = createEncodings([fromLoc, toLoc]);
      d "Encoded:", encoded
      emit 'encoded', encoded 
    server.once 'encoded', (data)->
      server.eval (data)->
        result = decode(data)
        d "Decoded:", result
        emit 'done'
      , data
    server.once 'done', ->      
      done(); 
     