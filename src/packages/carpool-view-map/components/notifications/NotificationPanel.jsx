// App component - represents the whole app
NotificationPanel = React.createClass({
  mixins: [ReactMeteorData],

  // Loads items from the notifications collection and puts them on this.data.notifications
  getMeteorData() {
    data = {
      notifications: []
    }
    var handle = Meteor.subscribe('Notifications');
    if(handle.ready()) {
      var query = {};
      var showHistory = false
  		query = {recievedAt: {$exists: showHistory}};
      data.notifications = NotificationHistory.find(query).fetch();
    }
    return data;
  },

  getNotifications() {

  },

  renderNotifications() {
    return this.data.notifications.map((task) => {
      return <Notification key={task._id} notification={task} />;
    });
  },

  render() {
    return (
      <div className="container">
        <header><h2>Notifications</h2></header>
        {this.renderNotifications()}
      </div>
    );
  }
});
