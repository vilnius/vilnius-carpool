import PageRoot from '../layout/PageRoot'

import {GoogleMapLoader, GoogleMap, Marker} from "react-google-maps";
import { createContainer } from 'meteor/react-meteor-data';
import { ReactiveVar } from 'meteor/reactive-var';
import { default as _ } from "lodash";


export default class ReactMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        markers: [{
          position: {
            lat: 25.0112183,
            lng: 121.52067570000001,
          },
          key: `Taiwan`,
          defaultAnimation: 2,
       }],
    }
    this.handleWindowResize = _.throttle(this.handleWindowResize, 500);
  }

  handleWindowResize() {
    console.log('handleWindowResize', this._googleMapComponent);
    triggerEvent(this._googleMapComponent, `resize`);
  }

  render () {
    const { googleReady} = this.props;
    if(false == googleReady) {
      return (
        <section style={{height: "100%"}}>
          Loading...
        </section>
      );
    } else
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
                defaultZoom={3}
                defaultCenter={{lat: -25.363882, lng: 131.044922}}>
              </GoogleMap>
            }
          />
        </section>
      );
  }
}

googleReady = new ReactiveVar(false);
googleServices.afterInit(function (){
  googleReady.set(true);
})

ReactMapView = createContainer(() => {
  return {
    googleReady: googleReady.get()
  }
}, ReactMap);

/*
 Can't use PageRoot as GoogleMap requires all divs above should be correct height -
 at least having height: "100%"
*/
//ReactMapView = PageRoot(ReactMapContainer)
