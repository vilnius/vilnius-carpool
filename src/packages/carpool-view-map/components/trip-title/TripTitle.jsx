TripTitle = React.createClass({
  render() {
    //d("Trip in props:", this.props);
    if(this.props.trip) {
      return (
        <span className="selectTrip" style={styles.titleWrapper} >
          <div>
            <strong>From: </strong>
            <span className="myTripFrom">{this.props.trip.fromAddress}</span>
          </div>
          <div>
            <strong>To: </strong>
            <span className="myTripTo">{this.props.trip.toAddress}</span>
          </div>
          <div>
            <strong>Stops: </strong><span className="stopsOnRoute">..</span>
          </div>
          <span >
            Time
          </span>
        </span>
      )
    } else {
      return (
        <span>Loading</span>
      )
    }
  },
})

var styles = {
  titleWrapper: {
    display: 'inline-block',
    paddingLeft: '10px'
  }
}
