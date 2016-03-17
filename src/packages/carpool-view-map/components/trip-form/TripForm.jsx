TripForm = React.createClass({
  getInitialState() {
    const currDate = new Date()
    return {
      from: '',
      to: '',
      time: currDate.getHours() + ':' + currDate.getMinutes(),
      date: currDate.getFullYear() + '-' + (currDate.getMonth() + 1) + '-' + currDate.getDate(),
    }
  },

  valueChanged(valueName, e) {
    this.setState({[valueName]: e.target.value})
  },

  getMeteorData() {
    // TODO get data required for autocomplete
    return {}
  },

  drive() {
    console.log('Drive', this.state)
    // TODO call db
  },

  ride() {
    console.log('Ride', this.state)
    // TODO call db
  },

  render() {
    return (
      <div>
        <div>To</div>
        <div><input type="text" placeholder="Kur vykstate?" style={styles.fullWidthInput} value={this.state.from} onChange={this.valueChanged.bind(this, 'from')} /></div>
        <div>From</div>
        <div><input type="text" placeholder="Iš" style={styles.fullWidthInput} onChange={this.valueChanged.bind(this, 'to')} /></div>
        <div style={styles.datesWrapper} >
          <input type="text" placeholder="Time" style={styles.timeInput} value={this.state.time} onChange={this.valueChanged.bind(this, 'time')} />
          <input type="text" placeholder="Date" style={styles.dateInput} value={this.state.date} onChange={this.valueChanged.bind(this, 'date')} />
        </div>
        <div style={styles.buttonsWrapper} >
          <input type="button" value="Vežu" style={styles.button} onClick={this.drive} />
          <input type="button" value="Važiuoju" style={styles.button} onClick={this.ride} />
        </div>
      </div>
    )
  },
})

// TODO Extract to css some day or replace with current styles
var styles = {
  datesWrapper: {
    display: 'flex',
  },
  buttonsWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
  button: {
    width: 'auto',
  },
  fullWidthInput: {
    width: 300,
  },
  timeInput: {
    width: 80,
  },
  dateInput: {
    width: 100,
  },
}
