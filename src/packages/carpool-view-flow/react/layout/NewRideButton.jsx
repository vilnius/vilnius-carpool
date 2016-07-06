import React from 'react'
import FloatingActionButton from 'material-ui/lib/floating-action-button'
import ContentAdd from 'material-ui/lib/svg-icons/content/add'
import {FlowHelpers} from '../../flowHelpers'

export default class newRideButton extends React.Component {
  render () {
    //console.log(this.props.isMobile);
    return (
      <FloatingActionButton data-cucumber="addTrip" primary style={{
          position: 'fixed',
          right: this.props.sideOffset + 12,
          bottom: this.props.bottomOffset + (this.props.isMobile ? 75 : 5),
        }}
        onClick={() => FlowHelpers.goExtendedQuery('NewRide')}
      >
        <ContentAdd />
      </FloatingActionButton>
    )
  }
}
