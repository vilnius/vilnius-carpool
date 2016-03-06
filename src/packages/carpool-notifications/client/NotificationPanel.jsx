// App component - represents the whole app
NotificationPanel = React.createClass({
  mixins: [ReactMeteorData],

  // Loads items from the Tasks collection and puts them on this.data.tasks
  getMeteorData() {
    data = {
      tasks: []
    }
    var handle = Meteor.subscribe('Notifications');
    if(handle.ready()) {
      var query = {};
      var showHistory = false
  		query = {recievedAt: {$exists: showHistory}};
      data.tasks = NotificationHistory.find(query).fetch();
    }
    return data;
  },

  getTasks() {

  },

  renderNotifications() {
    return this.data.tasks.map((task) => {
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
