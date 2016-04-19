import PageRoot from '../layout/PageRoot'

import {GoogleMapLoader, GoogleMap, Marker, Polyline} from "react-google-maps";
import { createContainer } from 'meteor/react-meteor-data';
import { ReactiveVar } from 'meteor/reactive-var';
import { default as _ } from "lodash";


export default class ReactMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: [{
        position: {
          lat: 54.6877209,
          lng: 25.305228100000022,
        },
        key: `From`,
        defaultAnimation: 2,
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
      },{
       position: {
         lat: 54.6779097,
         lng: 25.26246500000002,
       },
       key: `To`,
       defaultAnimation: 2,
       icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
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
      trip = {
        path: google.maps.geometry.encoding.decodePath("iexlI}lmyCn@q@dC{BfBqBbAqA\\o@z@yAvAuC~@_CdAiDr@kB^mAjBiE^q@^e@n@m@vAoAxAs@lAGrEz@hB`Av@`AlAxANPd@l@xAlBbCvCbDbFnAjC^v@n@fBj@lB`@dBvB`L~ClVxCrNh@dB\\dBr@xDb@rCNbCLjEJpCPlCR`BlAzHdAuAXMzAdD`CnE`@bAn@~Bp@hBjAjC|@|At@`Av@p@Xf@^fAx@vC~@lE~A|GXhCPdBp@~JV|DpAlNTvCPzC^lEeBd@wBp@ULi@b@aDrD_C|BcBz@iFbA{Cz@sBx@{@P}@TsHdBwCp@cCr@oHnBoBf@x@xJNxANvCVlDk@Pl@bIMEoC{A[GG?"),
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
