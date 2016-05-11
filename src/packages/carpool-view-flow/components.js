import React from 'react'
import {FlowHelpers} from './flowHelpers'
// Sample components
OffersMenu = React.createClass({
  render() {
    return <div>
      I'm green offers menu
    </div>
  }
});

RequestsMenu = React.createClass({
  render() {
    return <div>
      I'm blue requests menu
    </div>
  }
});

AllYourFilter = React.createClass({
  render() {
    return null // TODO
    return <div>
      <a href={FlowHelpers.extendPath( { ownTrips: 'all' } )}>All</a>
      | <a href={FlowHelpers.extendPath( { ownTrips: 'your' } )}>Your</a>
    </div>
  }
});


RideList = React.createClass({
  render() {
    return <div>
      <h1>This is ride list</h1>
    </div>
  }
});
