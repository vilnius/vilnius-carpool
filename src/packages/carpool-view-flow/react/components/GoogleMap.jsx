import {GoogleMapLoader, GoogleMap, Marker, Polyline} from "react-google-maps";
import { createContainer } from 'meteor/react-meteor-data';
import { ReactiveVar } from 'meteor/reactive-var';
import { default as _ } from "lodash";
import Loader from './Loader'
import {d, da} from 'meteor/spastai:logw'


export default class ReactMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      trip: props.trip,
      googleReady: false,
    }
    //d("Map Trip", props.trip);
    const driveStops = props.trip.stops;
    const ride = props.ride


    ride && this.state.markers.push({
      position: {
        lat: ride.fromLoc[1],
        lng: ride.fromLoc[0]
      },
      key: `RideFrom`,
      defaultAnimation: 2,
      icon: '/img/white-stop.png'
    });
    ride && this.state.markers.push({
      position: {
        lat: ride.toLoc[1],
        lng: ride.toLoc[0]
      },
      key: `RideTo`,
      defaultAnimation: 2,
      icon: '/img/white-stop.png'
    });


    this.state.markers.push({
      position: {
        lat: props.trip.fromLoc[1],
        lng: props.trip.fromLoc[0]
      },
      key: `From`,
      defaultAnimation: 2,
      icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    });

    this.state.markers.push({
      position: {
        lat: props.trip.fromLoc[1],
        lng: props.trip.fromLoc[0]
      },
      key: `From`,
      defaultAnimation: 2,
      icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    });


    const {stops = []} = props
    //d("Stops", driveStops);
    stops.map((stop, index) => {
      //d("Check stop", stop);
      icon = _.find(driveStops, {_id: stop._id}) ?
        'http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_yellow.png'
        : 'http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_white.png';
      this.state.markers.push({
        position: {
          lat: stop.loc[1],
          lng: stop.loc[0]
        },
        key: stop._id,
        defaultAnimation: 3,
        icon: icon
      });
    })

    this.state.markers.push({
     position: {
       lat: props.trip.toLoc[1],
       lng: props.trip.toLoc[0]
     },
     key: `To`,
     defaultAnimation: 2,
     icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
   });

    this.handleWindowResize = _.throttle(this.handleWindowResize, 500);
  }

  componentWillMount () {
    googleServices.afterInit(() => {
      this.setState({
        googleReady: true,
      })
    })
  }

  handleWindowResize() {
    console.log('handleWindowResize', this._googleMapComponent);
    triggerEvent(this._googleMapComponent, `resize`);
  }

  render () {
    const googleReady = this.state.googleReady
    if (false == googleReady) {
      return (
        <section style={{height: "100%", marginTop: 25}}>
          <Loader />
        </section>
      );
    } else
      {stops = this.props}
      trip = {
        path: google.maps.geometry.encoding.decodePath(this.state.trip.path),
        strokeOpacity: 0.5,
        strokeColor: "#FF0000",
      }

      return (
        <section style={{height: "100%"}}>
          <GoogleMapLoader
            containerElement={
              <div
                {...this.props}
                style={{
                  height: "100%",
                }}
              />
            }
            googleMapElement={
              <GoogleMap
                defaultZoom={12}
                defaultCenter={{lat: 54.67704, lng: 25.25405}}>
                {this.state.markers.map((marker, index) => {
                  return (
                    <Marker {...marker} />
                  );
                })}
                <Polyline {...trip}
                    options={{
                      strokeColor: "#0080BD",
                      strokeOpacity: 1,
                      strokeWeight: 3
                      }}
                />
              </GoogleMap>
            }
          />
        </section>
      );
  }
}

// googleReady = new ReactiveVar(false);
// googleServices.afterInit(function (){
//   googleReady.set(true);
// })
//
// ReactMapView = createContainer(() => {
//   return {
//     googleReady: googleReady.get()
//   }
// }, ReactMap);
ReactMapView = ReactMap

export default ReactMapView
