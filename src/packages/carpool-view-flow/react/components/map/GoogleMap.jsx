import React from 'react';
import { GoogleMapLoader, GoogleMap, Marker, Polyline} from "react-google-maps";
import { default as _ } from "lodash";
import Loader from '../common/Loader'
import { config } from '../../config'

/*global googleServices*/
/*global google*/


export default class ReactMap extends React.Component {
  constructor(props) {
    super(props);
    const {ride, trip: drive} = props;
    this.state = {
      markers: [],
      drive: drive,
      ride: ride,
      googleReady: false
    }
    //d("Map Trip", props.trip);

    const driveStops = drive && drive.stops || [];

    ride && this.state.markers.push({
      position: {
        lat: ride.fromLoc[1],
        lng: ride.fromLoc[0]
      },
      key: `RideFrom`,
      //defaultAnimation: 2,
      icon: '/img/white-stop.png'
    });
    ride && this.state.markers.push({
      position: {
        lat: ride.toLoc[1],
        lng: ride.toLoc[0]
      },
      key: `RideTo`,
      //defaultAnimation: 2,
      icon: '/img/white-stop.png'
    });

    drive && this.state.markers.push({
      position: {
        lat: props.trip.fromLoc[1],
        lng: props.trip.fromLoc[0]
      },
      key: 'From',
      title: 'From',
      //defaultAnimation: 2,
      icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    });

    const {stops = []} = props
    //d("Stops", driveStops);
    stops.forEach((stop) => {
      //d("Check stop", stop);
      let icon = _.find(driveStops, {_id: stop._id}) ?
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

    drive && this.state.markers.push({
      position: {
       lat: props.trip.toLoc[1],
       lng: props.trip.toLoc[0]
      },
      title: 'To',
      key: 'To',
      draggable: true,
      //defaultAnimation: 2,
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
    window.triggerEvent(this._googleMapComponent, `resize`);
  }

  render () {
    const googleReady = this.state.googleReady
    const {drive, ride} = this.state
    if (false == googleReady) {
     return (
       <section style={{height: "100%", marginTop: 25}}>
         <Loader />
       </section>
     );
   } else {
     const routeColor = (null === ride) ? config.colors.lightBlue : config.colors.green;
     const tripPolylineOptions = drive && {
       path: google.maps.geometry.encoding.decodePath(drive.path),
       strokeOpacity: 0.5,
       strokeColor: routeColor,
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
               defaultCenter={{lat: 54.67704, lng: 25.25405}}
             >
               {this.state.markers.map((marker) => {
                 return (
                   <Marker {...marker} />
                 );
               })}
               <Polyline {...tripPolylineOptions}
                 options={{
                   strokeColor: routeColor,
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
}

ReactMap.propTypes = {
  ride: React.PropTypes.object,
  trip: React.PropTypes.object
}
