import React from 'react'
import wrapMobileLayout from './NewMobileWrap'

export default class RideOfferDetails extends React.Component {
  render () {
    return (
      <div>
        RideOfferDetails
      </div>
    )
  }
}

RideOfferDetailsScreen = wrapMobileLayout(RideOfferDetails)
