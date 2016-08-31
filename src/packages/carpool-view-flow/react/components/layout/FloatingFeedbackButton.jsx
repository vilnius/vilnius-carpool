import React from 'react'
import FloatingActionButton from 'material-ui/lib/floating-action-button'
import FeedbackIcon from 'material-ui/lib/svg-icons/action/help-outline'

/*global FlowRouter*/

export default class FloatingFeedbackButton extends React.Component {
  render () {
    return (
      <FloatingActionButton mini data-cucumber="feedback" secondary style={{
          position: 'fixed',
          left: this.props.sideOffset + 12,
          bottom: this.props.bottomOffset + 75,
        }}
        onClick={() => FlowRouter.go('Feedback')}
      >
        <FeedbackIcon />
      </FloatingActionButton>
    )
  }
}

FloatingFeedbackButton.propTypes = {
  sideOffset: React.PropTypes.number.isRequired,
  bottomOffset: React.PropTypes.number.isRequired,
}
