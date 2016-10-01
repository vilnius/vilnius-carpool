import React from 'react'

import { TextField, RaisedButton } from 'material-ui'

/*global carpoolService*/
/*global FlowRouter*/

import { StyleSheet, css } from 'aphrodite'

const styles = StyleSheet.create({
  screenWrap: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
})

export default class FeedbackScreen extends React.Component {

  constructor (props) {
    super(props)

    this.submitFeeback = this.submitFeeback.bind(this)

    this.state = {
      feedbackText: '',
    }
  }

  submitFeeback () {
    //d('Your feedback should have been sent', this.state.feedbackText)
    carpoolService.saveFeedback(this.state.feedbackText)
    FlowRouter.go('RideOffers')
  }

  render () {
    return (
      <div className={css(styles.screenWrap)}>
        <TextField value={this.state.feedbackText}
          onChange={(e) => this.setState({ feedbackText: e.target.value })}
          hintText="Enter your feedback here"
          style={{
            width: this.props.width * 0.85,
          }}
          multiLine
        />
        <RaisedButton primary label="Submit feedback"
          onClick={this.submitFeeback}
          style={{width: this.props.width * 0.85, marginTop: 10}}
        />
      </div>
    )
  }
}

FeedbackScreen.propTypes = {
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
}
