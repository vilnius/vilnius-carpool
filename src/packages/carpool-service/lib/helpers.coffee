@rad = (x) ->
  x * Math.PI / 180

@getDistance = (p1, p2) ->
  R = 6378137
  dLat = rad(p2[1] - (p1[1]))
  dLong = rad(p2[0] - (p1[0]))
  a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(p1[1])) * Math.cos(rad(p2[1])) * Math.sin(dLong / 2) * Math.sin(dLong / 2)
  c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  d = R * c
