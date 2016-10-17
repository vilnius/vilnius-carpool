import React from 'react'
import FloatingActionButton from 'material-ui/lib/floating-action-button'
import ContentAdd from 'material-ui/lib/svg-icons/content/add'
import {FlowHelpers} from '../../../flowHelpers'

const FloatingNewTripButton = (props) => (
  <FloatingActionButton data-cucumber="addTrip" primary style={{
      position: 'fixed',
      right: props.sideOffset + 12,
      bottom: props.bottomOffset + (props.isMobile ? 75 : 5),
    }}
    onClick={() => FlowHelpers.goExtendedQuery('NewRide')}
  >
    <ContentAdd />
  </FloatingActionButton>
)

FloatingNewTripButton.propTypes = {
  sideOffset: React.PropTypes.number.isRequired,
  bottomOffset: React.PropTypes.number.isRequired,
  isMobile: React.PropTypes.bool.isRequired,
}

export default FloatingNewTripButton;
