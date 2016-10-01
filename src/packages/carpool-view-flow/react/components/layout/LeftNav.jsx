import React from 'react';
import LeftNav from '../lib-extensions/left-nav.js';
import { Avatar, FlatButton } from 'material-ui';
import NotificationsIcon from 'material-ui/lib/svg-icons/social/notifications'
import PersonOutlineIcon from 'material-ui/lib/svg-icons/social/person-outline'
import PersonIcon from 'material-ui/lib/svg-icons/social/person'
import AboutIcon from 'material-ui/lib/svg-icons/action/info-outline'
import FeedbackIcon from 'material-ui/lib/svg-icons/action/help-outline'
import { StyleSheet, css } from 'aphrodite'
import { getUserName } from 'meteor/carpool-view'

/*global Meteor*/
/*global FlowRouter*/
/*global flowControllerHelper*/

const styles = StyleSheet.create({
  leftNavWrap: {
    display: 'flex',
    flexDirection: 'column',
  },
  profileInfoWrap: {
    width: '100%',
    background: 'lightblue',
    paddingTop: 20,
    paddingBottom: 10,
  },
  button: {
    width: '100%',
    textAlign: 'left',
  },
});

export default class LeftNavWrap extends React.Component {

  constructor (props) {
    super(props)

    this.doLogout = this.doLogout.bind(this);

    this.state = {
      loggedIn: !!Meteor.user(),
    }
  }

  doLogout() {
    Meteor.logout();
    this.setState({loggedIn: false})
  }

  closeMenu () {
    this.props.onRequestChange(false);
  }

  render () {
    return (
      <LeftNav
        open={this.props.open}
        onRequestChange={this.props.onRequestChange}
        docked={false}
      >
        <div className={css(styles.leftNavWrap)}>
          <div className={css(styles.profileInfoWrap)}>
            <Avatar src={this.props.avatar} size={60} style={{marginLeft: 10}} />
            <div style={{width: 74, marginTop: 3, textAlign: 'center'}}>
              {getUserName(Meteor.user()).split(' ')[0]}
            </div>
          </div>
          <div style={{marginTop: 2, width: '100%'}}>
            <FlatButton className={css(styles.button)} label="Profile" icon={<PersonIcon />}
              onClick={() => {
                this.closeMenu()
                FlowRouter.go('Profile')
              }}
            />
          </div>
          <div style={{width: '100%'}}>
            <FlatButton className={css(styles.button)} label="Notifications" icon={<NotificationsIcon />}
              onClick={() => {
                this.closeMenu();
                FlowRouter.go('NotificationSettings');
              }}
            />
          </div>
          {this.state.loggedIn ? (
            <div style={{marginTop: 2, width: '100%'}}>
              <FlatButton className={css(styles.button)} label={`Logout ${getUserName(Meteor.user()).split(' ')[0]}`} icon={<PersonOutlineIcon />}
                onClick={this.doLogout}
              />
            </div>
          ) : (
            <div style={{marginTop: 2, width: '100%'}}>
              <FlatButton className={css(styles.button)} label="Login" icon={<PersonOutlineIcon />}
                onClick={() => flowControllerHelper.goToView('Login')}
              />
            </div>
          )}
          <div style={{width: '100%'}}>
            <FlatButton className={css(styles.button)} label="About" icon={<AboutIcon />}
              onClick={() => {
                this.closeMenu();
                FlowRouter.go('About');
              }}
            />
          </div>
          <div style={{width: '100%'}}>
            <FlatButton className={css(styles.button)} label="Leave feedback" icon={<FeedbackIcon />}
              onClick={() => {
                this.closeMenu();
                FlowRouter.go('Feedback');
              }}
            />
          </div>
        </div>
      </LeftNav>
    )
  }
}

LeftNavWrap.propTypes = {
  onRequestChange: React.PropTypes.func.isRequired,
  open: React.PropTypes.bool.isRequired,
  avatar: React.PropTypes.string.isRequired,
}
