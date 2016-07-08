import React from 'react'
import FloatingActionButton from 'material-ui/lib/floating-action-button'
import ContentAdd from 'material-ui/lib/svg-icons/content/add'
import {FlowHelpers} from '../../flowHelpers'

const NewRideButton = ({ sideOffset, bottomOffset, isMobile }) => (
  <FloatingActionButton data-cucumber="addTrip" primary style={{
      position: 'fixed',
      right: sideOffset + 12,
      bottom: bottomOffset + (isMobile ? 75 : 5),
    }}
    onClick={() => FlowHelpers.goExtendedQuery('NewRide')}
  >
    <ContentAdd />
  </FloatingActionButton>
)

export default NewRideButton;
