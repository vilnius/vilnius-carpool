import React from 'react'
import { GoogleMapLoader, GoogleMap, Marker, Polyline} from "react-google-maps"
import Loader from '../common/Loader'
import { config } from '../../config'

/*global googleServices*/
/*global google*/

export default class TripMap extends React.Component {

  constructor (props) {
    super(props)

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
    if (stop.name === 'dA') {
      return 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
    } else if (stop.name === 'dB') {
      return 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
    } else {
      return 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
    }
  }

  getMapDefaults (itenary) {
    const startPoint = itenary[0].loc
    const endPoint = itenary[itenary.length - 1].loc
    return {
      lat: (startPoint[1] + endPoint[1]) / 2,
      lng: (startPoint[0] + endPoint[0]) / 2,
      defaultZoom: 12,
    }
  }

  renderMarker (stop) {
    const position = { lng: stop.loc[0], lat: stop.loc[1] }
    const icon = this.getMarkerIcon(stop)
    return (
      <Marker
        title={stop.title}
        key={stop.title}
        icon={icon}
        position={position}
        draggable
      />
    )
  }

  renderTripLine (path) {
    return (
      <Polyline
        path={google.maps.geometry.encoding.decodePath(path)}
        options={{
          strokeOpacity: 0.8,
          strokeColor: '#304FFE', // TODO config.colors.green if drive
          strokeWeight: 3,
        }}
      />
    )
  }

  render () {
    if (!this.state.googleReady) {
      return (
        <section style={{height: "100%", marginTop: 25}}>
          <Loader />
        </section>
      );
    } else {
      const mapDefaults = this.getMapDefaults(this.props.itenary)
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
              {this.props.itenary.map(this.renderMarker)}
              {this.renderTripLine(this.props.path)}
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
  itenary: React.PropTypes.array.isRequired,
  path: React.PropTypes.string.isRequired,
}
