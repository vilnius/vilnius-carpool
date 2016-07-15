import React from 'react'
import BackIcon from 'material-ui/lib/svg-icons/navigation/arrow-back'
import { IconButton } from 'material-ui';

export default class BackButton extends React.Component {
  render () {
    return (
      <IconButton onClick={() => window.history.back()}>
        <BackIcon color="white" />
      </IconButton>
    )
  }
}
