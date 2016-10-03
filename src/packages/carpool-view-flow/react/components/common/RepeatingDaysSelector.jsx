import React from 'react'
import Dialog from '../lib-extensions/MuiDialog.jsx'
import FlatButton from 'material-ui/lib/flat-button'
import Checkbox from 'material-ui/lib/checkbox';
import Divider from 'material-ui/lib/divider';
import { StyleSheet, css } from 'aphrodite'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const styles = StyleSheet.create({
  selection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 20,
    paddingRight: 5,
    cursor: 'pointer',
    alignItems: 'center',
  },
})

export default class RepeatingDaysSelector extends React.Component {

  constructor (props) {
    super(props)

    this.toggleDontRepeat = this.toggleDontRepeat.bind(this);
    this.done = this.done.bind(this);

    this.state = {
      open: false,
      repeatingDays: [1, 3, 4, 5],
      dontRepeat: false,
    }
  }

  openRepeatingDaysSelector (repeatingDays, dontRepeat) {
    this.setState({
      open: true,
      repeatingDays,
      dontRepeat,
    })
  }

  done () {
    this.setState({
      open: false,
    })
    if (this.props.onDaysSelected) {
      this.props.onDaysSelected(this.state.repeatingDays, this.state.dontRepeat || this.state.repeatingDays.length === 0)
    }
  }

  toggleDay (dayNum) {
    const di = this.state.repeatingDays.indexOf(dayNum)
    const isChecked = di !== -1
    if (!isChecked) {
      const repeatingDays = this.state.repeatingDays
      repeatingDays.push(dayNum)
      this.setState({
        repeatingDays,
        dontRepeat: false,
      })
    } else if (isChecked) {
      const repeatingDays = this.state.repeatingDays
      repeatingDays.splice(di, 1)
      this.setState({
        repeatingDays,
        dontRepeat: false,
      })
    }
  }

  toggleDontRepeat () {
    this.setState({
      dontRepeat: !this.state.dontRepeat,
    })
  }

  render () {
    return (
      <Dialog
        open={this.state.open}
        actions={[
          <FlatButton key="cancel" label="Cancel" onClick={() => this.setState({open: false})} secondary />,
          <FlatButton key="save" data-cucumber="set-recurrent" label="Done" onClick={this.done} secondary />
        ]}
        title="Select days"
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
        }}>
          {days.map((d, i) => (
            <div key={i}
              data-cucumber={'day-'+i}
              className={css(styles.selection)}
              style={{
                transition: 'background-color 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
                background: this.state.repeatingDays.indexOf(i) !== -1 && !this.state.dontRepeat
                  ? 'rgba(0, 141, 208, 0.15)'
                  : 'none'
              }}
              onClick={() => this.toggleDay(i)}
            >
              <div>
                {d}
              </div>
              <div>
                <Checkbox checked={this.state.repeatingDays.indexOf(i) !== -1 && !this.state.dontRepeat} />
              </div>
            </div>
          ))}
          <Divider style={{marginTop: 11}} />
          <div
            className={css(styles.selection)}
            onClick={this.toggleDontRepeat}
          >
            <div>
              Don't repeat
            </div>
            <div>
              <Checkbox checked={this.state.dontRepeat} />
            </div>
          </div>
        </div>
      </Dialog>
    )
  }
}

RepeatingDaysSelector.propTypes = {
  onDaysSelected: React.PropTypes.func.isRequired,
}
