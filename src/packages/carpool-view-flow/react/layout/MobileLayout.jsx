import React from 'react'
import Paper from 'material-ui/lib/paper'
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import NotificationsIcon from 'material-ui/lib/svg-icons/social/notifications'
import CarIcon from 'material-ui/lib/svg-icons/maps/directions-car'
import RequestsIcon from 'material-ui/lib/svg-icons/action/feedback'
import NewRideButton from './NewRideButton'
import BackIcon from 'material-ui/lib/svg-icons/navigation/arrow-back'
import MenuIcon from 'material-ui/lib/svg-icons/navigation/menu'
import BottomTabs from './BottomTabs'
import LeftNav from 'material-ui/lib/left-nav'
import Avatar from 'material-ui/lib/avatar'
import FlatButton from 'material-ui/lib/flat-button';
import PersonIcon from 'material-ui/lib/svg-icons/social/person'
import AboutIcon from 'material-ui/lib/svg-icons/action/help'

import { config } from '../config'
import {d, da} from 'meteor/spastai:logw'

export default class MobileLayout extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      menuOpen: false,
    }
  }

  render () {
    return (
      <div>
        <Paper
          style={{
            position: 'fixed',
            top: 0,
            height: 50,
            width: this.props.width,
            background: config.colors.main,
            zIndex: 1,
            color: 'white'
          }} >
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            height: '100%',
          }} >
            <div style ={{
              marginLeft: 12,
            }}>
              {this.props.config.innerScreen ? (
                <BackIcon color="white" onClick={() => window.history.back()} />
              ) : (
                <MenuIcon color="white" onClick={() => this.setState({ menuOpen: true })} />
              )}
            </div>
            <div style={{
              marginLeft: 12,
              fontSize: 20,
            }}>
              {this.props.config.title}
            </div>
          </div>
        </Paper>
        <div style={{
          marginTop: 52,
          paddingBottom: this.props.config.innerScreen ? 0 : 54,
        }}>
          {this.props.children}
        </div>
        {this.props.config.innerScreen ? null : (
          <BottomTabs />
        )}
        {this.props.config.newRideButton ? (
          <NewRideButton />
        ) : null}
        {this.props.innerScreen ? null : (
          <LeftNav
            open={this.state.menuOpen}
            onRequestChange={(menuOpen) => this.setState({ menuOpen })}
            docked={false}
          >
            <div style={{
              display: 'flex',
              flexDirection: 'column',
            }}>
              <div style={{
                width: '100%',
                background: 'lightblue',
                paddingTop: 20,
                paddingBottom: 10
              }}>
                <Avatar src="http://lorempixel.com/200/200/people/0" size={60} style={{marginLeft: 10}} />
                <div style={{marginLeft: 17, marginTop: 3}}>
                  Name
                </div>
              </div>
              <div style={{marginTop: 2, width: '100%'}}>
                <FlatButton style={{width: '100%', textAlign: 'left'}} label="Profile" icon={<PersonIcon />}
                  onClick={() => muiControllerHelper.goToView('Profile')}
                />
              </div>
              <div style={{width: '100%'}}>
                <FlatButton style={{width: '100%', textAlign: 'left'}} label="Notifications" icon={<NotificationsIcon />}
                  onClick={() => muiControllerHelper.goToView('NotificationSettings')}
                />
              </div>
              <div style={{width: '100%'}}>
                <FlatButton style={{width: '100%', textAlign: 'left'}} label="About" icon={<AboutIcon />}
                  onClick={() => muiControllerHelper.goToView('About')}
                />
              </div>
            </div>
          </LeftNav>
        )}
      </div>
    )
  }
}
