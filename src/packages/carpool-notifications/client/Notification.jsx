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
    da(["trips-notification"], "Notification subscribtion ready:"+handle.ready());
    if(handle.ready()) {
      var trip = carpoolService.getTrip(this.props.notification.trip);
      if(trip) {
        address = `${trip.fromAddress}`
        if (this.props.notification.reason == "matched") {
          reason = "Matched trip"
        }
        da(["trips-notification"], "Notification for trip "+this.props.notification.trip, address);
      } else {
        da(["trips-notification"], "Can't show notified trip "+this.props.notification.trip, address);
      }
    } else {
      da(["trips-notification"], "Loading notified trip "+this.props.notification.trip);
    }
    return {
      text: address,
      reason: reason
    }
  },


  selectTrip() {
    da(["trips-matcher"], "Using globally defined functions",this.props.notification);
    selectTrip(this.props.notification.trip)
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
          <span className="selectNotification" onClick={this.selectTrip}>
          <h4 className="media-heading">{this.data.reason}</h4>
          {this.data.text}
          </span>
          <button type="button" className="dismissNotification btn" onClick={this.dismissNotification}>
            <span className="glyphicon glyphicon-remove"></span>
          </button>
        </div>
      </div>
    );
  }
});
