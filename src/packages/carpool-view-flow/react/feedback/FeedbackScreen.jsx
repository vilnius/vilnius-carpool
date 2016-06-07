import React from 'react'

import { TextField, RaisedButton } from 'material-ui'

export default class FeedbackScreen extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      feedbackText: '',
    }
  }

  submitFeeback () {
    alert('Your feedback should have been sent')
    FlowRouter.go('RideOffers')
  }

  render () {
    return (
      <div style={{
        marginTop: 60,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <TextField value={this.state.feedbackText}
          onChange={(e) => {this.setState({feedbackText: e.target.value})}}
          hintText="Enter your feedback here"
          style={{
            width: window.innerWidth * 0.85,
          }}
          multiLine
        />
        <RaisedButton primary label="Submit feedback"
          onClick={this.submitFeeback.bind(this)}
          style={{width: window.innerWidth * 0.85, marginTop: 5}}
        />
      </div>
    )
  }
}
