// Task component - represents a single todo item
Notification = React.createClass({
  propTypes: {
    // This component gets the task to display through a React prop.
    // We can use propTypes to indicate it is required
    notification: React.PropTypes.object.isRequired
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
          <h4 className="media-heading">{this.props.notification.text}</h4>
          <button type="button" className="dismissNotification btn" onClick={this.dismissNotification}>
            <span className="glyphicon glyphicon-remove"></span>
          </button>
        </div>
      </div>
    );
  }
});
