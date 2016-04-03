TripTitle = React.createClass({
  render() {
    //d("Trip in props:", this.props);
    if(this.props.trip) {
      var timeString = moment(this.props.trip.time).format("lll");
      return (
        <dl className="dl-horizontal">
          <dt>From:</dt>
          <dd>{this.props.trip.fromAddress}</dd>

          <dt>To:</dt>
          <dd>{this.props.trip.toAddress}</dd>

          <dt>Time:</dt>
          <dd>{timeString}</dd>

          <dt>Stops:</dt>
          {this.props.trip.stops.map(function(stop) {
            return (<dd key={stop._id}>{stop.title}</dd>)
          })}
        </dl>
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
