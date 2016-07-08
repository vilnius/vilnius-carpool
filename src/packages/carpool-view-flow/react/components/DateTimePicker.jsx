import React from 'react'
import Timepicker from './timepicker.js';
import Clock from 'material-ui/lib/time-picker/clock'
import Dialog from './MuiDialog.jsx'
import FlatButton from 'material-ui/lib/flat-button'
import Divider from 'material-ui/lib/divider';
import ChevronLeft from 'material-ui/lib/svg-icons/navigation/chevron-left'
import ChevronRight from 'material-ui/lib/svg-icons/navigation/chevron-right'
import moment from 'moment'
import { config } from '../config'

export default class DateTimePicker extends React.Component {
  constructor (props) {
    super(props)

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
      date,
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
    const contentWidth = Math.min(768, 300 + 2 * bonusWidth)
    return (
      <Dialog
        open={this.state.open}
        actions={[
          <FlatButton key="cancel" label="Cancel" onClick={() => this.setState({open: false})} secondary />,
          <FlatButton key="save" label="Done" onClick={this.done.bind(this)} secondary />
        ]}
        modal={true}
        contentStyle={{
          width: contentWidth,
          padding: 0,
          transform: 'none',
        }}
      >
        <div style={{
          width: contentWidth,
          display: 'flex',
          flexDirection: 'row',
          height: 30,
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 15,
        }}>
          <div style={{
              width: 100,
              textAlign: 'center',
              borderBottom: `3px solid ${this.state.isDepartureDate ? 'rgba(0, 0, 0, 0.25)' : config.colors.main}`,
              color: this.state.isDepartureDate ? 'rgba(0, 0, 0, 0.25)' : config.colors.main,
              cursor: 'pointer',
            }}
            onClick={() => {this.setState({isDepartureDate : false})}}
          >
            ARRIVE BY
          </div>
          <div style={{
              width: 100,
              textAlign: 'center',
              borderBottom: `3px solid ${this.state.isDepartureDate ? config.colors.main : 'rgba(0, 0, 0, 0.25)'}`,
              color : this.state.isDepartureDate ? config.colors.main : 'rgba(0, 0, 0, 0.25)',
              cursor: 'pointer',
            }}
            onClick={() => {this.setState({isDepartureDate : true})}}
          >
            DEPART AT
          </div>
        </div>
        <div style={{
          paddingTop: 10,
          margin: '0px auto',
          fontSize: 20,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}>
          <div style={{
            margin: '0px auto',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottm: 5,
          }}>
            <ChevronLeft style={{width: 30, height: 30, marginTop: -1}} onClick={this.addDays.bind(this, -1)} />
              {this.state.date.format('ddd, DD MMMM YYYY')}
            <ChevronRight style={{width: 30, height: 30, marginTop: -1}} onClick={this.addDays.bind(this, 1)} />
          </div>
          <Divider />
          <div style={{width: 300, marginTop: 5}}>
            <Timepicker size={300} onChange={this.timepickerChanged.bind(this)} hours={this.state.date.hours()} minutes={this.state.date.minutes()}/>
          </div>
        </div>
      </Dialog>
    )
  }
}
