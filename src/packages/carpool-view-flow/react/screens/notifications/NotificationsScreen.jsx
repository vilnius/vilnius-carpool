import React from 'react'
import { createContainer } from 'meteor/react-meteor-data';
import NotificationCard from './NotificationCard'
import Loader from '../../components/common/Loader'
import Snackbar from 'material-ui/lib/snackbar';

import { StyleSheet, css } from 'aphrodite'

/*global Progress*/
/*global Meteor*/
/*global NotificationHistory*/

// const notifications = [{
//   name: 'Agnė',
//   date: 'May 29, 17:40',
//   from: 'Akropolis',
//   to: 'Naugarduko g. 65',
//   notificationType: 'ride offer',
//   image: 'http://lorempixel.com/200/200/people/' + Math.round(Math.random() * 9),
// }]

const styles = StyleSheet.create({
  screenWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 8, // Like material-ui List
    paddingBottom: 8,
    overflow: 'scroll',
  },
})

export default class Notifications extends React.Component {

  constructor(props) {
    super(props);

    this.showSnackbar = this.showSnackbar.bind(this);

    this.state = {
      snackbarOpen: false,
      snackbarText: ''
    };
  }

  handleRequestClose() {
    //d("Close snackbar")
    this.setState({
      snackbarOpen: false,
    });
  }

  showSnackbar(message) {
    //d("Showing snack message", message)
    this.setState({
      snackbarText: message,
      snackbarOpen: true
    });
  }

  render () {
    const { progress, notifications } = this.props;
    //console.log("NotificationScreen progress", progress.getProgress())
    //d("NotificationScreen props", this.props)
    if (100 != progress.getProgress()) {
      //console.log("Show loader");
      return (
        <section style={{height: "100%", marginTop: 25}}>
          <Loader />
        </section>
      );
    } else {
      //console.log("Show notifications");
      return (
        <div className={css(styles.screenWrap)} style={{ height: this.props.height }}>
          {notifications.map((notification, i) => (
            <NotificationCard key={i} notification={notification} width={this.props.width}
              snack={this.showSnackbar}
            />
          ))}
          <Snackbar
            open={this.state.snackbarOpen}
            message={this.state.snackbarText}
            autoHideDuration={4000}
            onRequestClose={() => this.handleRequestClose()}
          />
        </div>
      )
    }
  }
}

Notifications.propTypes = {
  width: React.PropTypes.number.isRequired,
  progress: React.PropTypes.object,
  notifications: React.PropTypes.array,
};

export default createContainer(() => {
  const progress = new Progress();
  let notifications
  var handle = Meteor.subscribe('Notifications');
  if(handle.ready()) {
    //console.log("NotificationScreen handle ready")
    progress.setProgress("notifications", 100);
    var query = {};
    //query = {recievedAt: {$exists: showHistory}};
    query = {}
    notifications = NotificationHistory.find(query, {sort:{addedAt:-1}}).fetch();
  } else {
    //console.log("NotificationScreen progress 0")
    progress.setProgress("notifications", 0);
  }

  return {
    progress,
    notifications,
  };
}, Notifications);
