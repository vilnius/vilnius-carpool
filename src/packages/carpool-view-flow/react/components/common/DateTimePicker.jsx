import React from 'react'
import Timepicker from '../lib-extensions/timepicker.js';
import Dialog from '../lib-extensions/MuiDialog.jsx'
import FlatButton from 'material-ui/lib/flat-button'
import Divider from 'material-ui/lib/divider';
import ChevronLeft from 'material-ui/lib/svg-icons/navigation/chevron-left'
import ChevronRight from 'material-ui/lib/svg-icons/navigation/chevron-right'
import moment from 'moment'
import { StyleSheet, css } from 'aphrodite'

import { config } from '../../config'

const styles = StyleSheet.create({
  headerWrap: {
    display: 'flex',
    flexDirection: 'row',
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15,
  },
  contentWrap: {
    paddingTop: 10,
    margin: '0px auto',
    fontSize: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  dateDisplayWrap: {
    margin: '0px auto',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
})

export default class DateTimePicker extends React.Component {
  constructor (props) {
    super(props)

    this.done = this.done.bind(this);
    this.timepickerChanged = this.timepickerChanged.bind(this);

    this.state = {
      open: false,
      date: moment(),
      isDepartureDate: false,
    }
  }

  openDateTimePicker (isDepartureDate, date) {
    this.setState({
      open: true,
      isDepartureDate,
      date: date ? date.clone() : moment()
    })
  }

  addDays(numDays) {
    this.state.date.add(numDays, 'days')
    this.forceUpdate()
  }

  timepickerChanged (hours, minutes) {
    this.state.date.hours(hours)
    this.state.date.minutes(minutes)
  }

  done () {
    this.setState({
      open: false,
    })
    if (this.props.onDateSelected) {
      this.props.onDateSelected({
        isDepartureDate: this.state.isDepartureDate,
        date: this.state.date
      })
    }
  }

  render () {
    const bonusWidth = (window.innerWidth - 320) / 4
    const contentWidth = Math.min(768, 300 + 2 * bonusWidth);
    //d("bTime for DateTimePicker", this.state.date)
    return (
      <Dialog
        open={this.state.open}
        actions={[
          <FlatButton key="cancel" label="Cancel" onClick={() => this.setState({open: false})} secondary />,
          <FlatButton key="save" label="Done" onClick={this.done} secondary />
        ]}
        modal
        contentStyle={{
          width: contentWidth,
          padding: 0,
          transform: 'none',
        }}
      >
        <div style={{ width: contentWidth }} className={css(styles.headerWrap)}>
          <div style={{
              width: 100,
              textAlign: 'center',
              borderBottom: `3px solid ${this.state.isDepartureDate ? 'rgba(0, 0, 0, 0.25)' : config.colors.main}`,
              color: this.state.isDepartureDate ? 'rgba(0, 0, 0, 0.25)' : config.colors.main,
              cursor: 'pointer',
            }}
            onClick={() => { this.setState({ isDepartureDate : false }) }}
          >
            ARRIVE BY
          </div>
          {/*
            TODO Depart at temporarily disabled, uncomment when it is implemented in back end
            <div style={{
              width: 100,
              textAlign: 'center',
              borderBottom: `3px solid ${this.state.isDepartureDate ? config.colors.main : 'rgba(0, 0, 0, 0.25)'}`,
              color : this.state.isDepartureDate ? config.colors.main : 'rgba(0, 0, 0, 0.25)',
              cursor: 'pointer',
            }}
            onClick={() => { this.setState({ isDepartureDate : true }) }}
          >
            DEPART AT
          </div> */}
        </div>
        <div className={css(styles.contentWidth)}>
          <div className={css(styles.dateDisplayWrap)}>
            <ChevronLeft style={{width: 30, height: 30, marginTop: -1}} onClick={() => this.addDays(-1)} />
              {this.state.date.format('ddd, DD MMMM YYYY')}
            <ChevronRight style={{width: 30, height: 30, marginTop: -1}} onClick={() => this.addDays(1)} />
          </div>
          <Divider />
          <div style={{width: 300, marginTop: 5}}>
            <Timepicker size={300} onChange={this.timepickerChanged} hours={this.state.date.hours()} minutes={this.state.date.minutes()} />
          </div>
        </div>
      </Dialog>
    )
  }
}

DateTimePicker.propTypes = {
  onDateSelected: React.PropTypes.func.isRequired,
}
