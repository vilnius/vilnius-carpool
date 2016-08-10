import React from 'react'
import { GoogleMapLoader, GoogleMap, Marker, Polyline} from "react-google-maps"
import { config } from '../../config'
import Loader from '../common/Loader'

/*global googleServices*/
/*global google*/

// const d = console.log.bind(console);

const stopMarkers = {
  "dA": 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
  "dB": 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
  "rA": 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
  "rB": 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
  // "sA": '/img/red-dot-small.png',
  // "sB": '/img/green-dot-small.png'
  "sA": '/img/yellow-stop.png',
  "sB": '/img/yellow-stop.png'
}

export default class TripMap extends React.Component {

  constructor (props) {
    super(props)
    //d("Render itinerary", this.props.itinerary);
    this.renderMarker = this.renderMarker.bind(this)

    this.state = {
      googleReady: false,
    }
  }

  componentWillMount () {
    googleServices.afterInit(() => {
      this.setState({
        googleReady: true,
      })
    })
  }

  getMarkerIcon (stop) {
      return stopMarkers[stop.name] || 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
  }

  getMapDefaults (itinerary) {
    if(itinerary.length == 0) {
      return {
        defaultZoom: 12,
      }
    } else {
      const startPoint = itinerary[0].loc
      const endPoint = itinerary[itinerary.length - 1].loc
      return {
        lat: (startPoint[1] + endPoint[1]) / 2,
        lng: (startPoint[0] + endPoint[0]) / 2,
        defaultZoom: 12,
      }
    }
  }

  renderMarker (stop) {
    const icon = this.getMarkerIcon(stop)
    // d("Marker icon", icon)
    return (
      <Marker
        title={stop.title}
        key={stop._id+"-m"}
        icon={icon}
        position={googleServices.toLatLng(stop.loc)}
        draggable
      />
    )
  }

  renderStopPath(stop) {
    // d("Render path for stop", JSON.stringify(stop));
    if(stop.path) {
      return (
        <Polyline
          key={stop._id+"-p"}
          path={google.maps.geometry.encoding.decodePath(stop.path)}
          options={{
            strokeOpacity: 0.8,
            strokeColor: stop.mode == "DRIVING" ? config.colors.green : config.colors.lightBlue,
            strokeWeight: 3,
          }}
        />
      )
    } else
     return null;
  }

  render () {
    if (!this.state.googleReady) {
      return (
        <section style={{height: "100%", marginTop: 25}}>
          <Loader />
        </section>
      );
    } else {
      const mapDefaults = this.getMapDefaults(this.props.itinerary)
      return (
        <GoogleMapLoader
          containerElement={
            <div style={{ width: this.props.width, height: this.props.height }} />
          }
          googleMapElement={
            <GoogleMap
              defaultZoom={mapDefaults.defaultZoom}
              defaultCenter={{ lat: mapDefaults.lat, lng: mapDefaults.lng }}
            >
              {this.props.itinerary.map(this.renderMarker)}
              {this.props.itinerary.map(this.renderStopPath)}
            </GoogleMap>
          }
        />
      )
    }
  }
}

TripMap.propTypes = {
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
  itinerary: React.PropTypes.array.isRequired,
}
