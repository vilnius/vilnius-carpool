// Task component - represents a single todo item
Notification = React.createClass({
  mixins: [ReactMeteorData],

  propTypes: {
    // This component gets the task to display through a React prop.
    // We can use propTypes to indicate it is required
    notification: React.PropTypes.object.isRequired
  },

  getMeteorData() {
    var handle = Meteor.subscribe('notifiedTrips');

    var address = ""
    var reason = ""
    if(handle.ready()) {
      var trip = carpoolService.getTrip(this.props.notification.trip);
      if(trip) {
        address = `${trip.fromAddress}`
        if (this.props.notification.reason == "matched") {
          reason = "Matched trip"
        }
        da(["trips-matcher"], "Notification for trip "+this.props.notification.trip, address);
      } else {
        da(["trips-matcher"], "Can't show notified trip "+this.props.notification.trip, address);
      }
    } else {
      da(["trips-matcher"], "Loading notified trip "+this.props.notification.trip);
    }
    return {
      text: address,
      reason: reason
    }
  },

  dismissNotification() {
    NotificationHistory.update({_id: this.props.notification._id}, {
      $set: {
        "recievedAt": new Date()
      }
    });
  },

  render() {
    return (
      <div className="media">
        <div className="media-left">
          <a href="#">
            <img className="media-object" src="img/icon-driver.png" alt="..." />
          </a>
        </div>
        <div className="media-body">
          <h4 className="media-heading">{this.data.reason}</h4>
          {this.data.text}
          <button type="button" className="dismissNotification btn" onClick={this.dismissNotification}>
            <span className="glyphicon glyphicon-remove"></span>
          </button>
        </div>
      </div>
    );
  }
});
