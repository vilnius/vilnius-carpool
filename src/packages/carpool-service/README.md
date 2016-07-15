To prepare test data
 mongoexport -h localhost:3001 -d meteor -c trips -q '{ _id : "bWMSQ263C2pELckHk"}' --out ride.json
 mongoexport -h localhost:3001 -d meteor -c trips -q '{ _id : "AFAHLEzX5ZayjT9D5"}' --out drive.json


To run the tests
  meteor test-packages packages/carpool-service --settings settings.json

Multiple geo locations used -
   - google.maps.geometry.poly
   - mongo $near
   - geolib
