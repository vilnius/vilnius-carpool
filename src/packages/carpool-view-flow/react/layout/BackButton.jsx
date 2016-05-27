import React from 'react'
import BackIcon from 'material-ui/lib/svg-icons/navigation/arrow-back'

export default class BackButton extends React.Component {
  render () {
    return (
      <BackIcon color="white" onClick={() => window.history.back()} />
    )
  }
}
