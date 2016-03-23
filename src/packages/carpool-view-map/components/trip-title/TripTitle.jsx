TripTitle = React.createClass({
  render() {
    //d("Trip in props:", this.props);
    if(this.props.trip) {
      return (
        <dl className="dl-horizontal">
          <dt>From:</dt>
          <dd>{this.props.trip.fromAddress}</dd>

          <dt>To:</dt>
          <dd>{this.props.trip.toAddress}</dd>

          <dt>Stops:</dt>
          <dd></dd>
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
