import React from 'react'
import Dialog from './MuiDialog.jsx'
import FlatButton from 'material-ui/lib/flat-button'
import Checkbox from 'material-ui/lib/checkbox';
import Divider from 'material-ui/lib/divider';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default class RepeatingDaysSelector extends React.Component {

  constructor (props) {
    super(props)
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
      this.props.onDaysSelected(this.state.repeatingDays, this.state.dontRepeat)
    }
  }

  toggleDay (dayNum, e, isChecked, c) {
    const di = this.state.repeatingDays.indexOf(dayNum)
    if (isChecked && di === -1) {
      const repeatingDays = this.state.repeatingDays
      repeatingDays.push(dayNum)
      this.setState({
        repeatingDays,
        dontRepeat: false,
      })
    } else if (!isChecked && di !== -1) {
      const repeatingDays = this.state.repeatingDays
      repeatingDays.splice(di, 1)
      this.setState({
        repeatingDays,
        dontRepeat: false,
      })
    }
  }

  toggleDontRepeat (e, checked) {
    this.setState({
      dontRepeat: checked,
    })
  }

  render () {
    return (
      <Dialog
        open={this.state.open}
        actions={[
          <FlatButton key="cancel" label="Cancel" onClick={() => this.setState({open: false})} secondary />,
          <FlatButton key="save" label="Done" onClick={this.done.bind(this)} secondary />
        ]}
        title="Select days"
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
        }}>
          {days.map((d, i) => (
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: 10,
              paddingLeft: 20,
              paddingRight: 5,
            }}>
              <div>
                {d}
              </div>
              <div>
                <Checkbox checked={this.state.repeatingDays.indexOf(i) !== -1 && !this.state.dontRepeat} onCheck={this.toggleDay.bind(this, i)} />
              </div>
            </div>
          ))}
          <Divider style={{marginTop: 11}} />
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 10,
            paddingLeft: 20,
            paddingRight: 5,
          }}>
            <div>
              Don't repeat
            </div>
            <div>
              <Checkbox checked={this.state.dontRepeat} onCheck={this.toggleDontRepeat.bind(this)} />
            </div>
          </div>
        </div>
      </Dialog>
    )
  }
}