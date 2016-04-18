import React from 'react'
import wrapMobileLayout from './NewMobileWrap'

export default class NewRideOffer extends React.Component {
  render () {
    return (
      <div>
        New ride offer
      </div>
    )
  }
}

NewRideOfferScreen = wrapMobileLayout(NewRideOffer)
