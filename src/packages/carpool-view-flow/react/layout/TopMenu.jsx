import React from 'react'
import LeftNav from './left-nav.js'
import Avatar from 'material-ui/lib/avatar'
import BackButton from './BackButton'
import MenuIcon from 'material-ui/lib/svg-icons/navigation/menu'
import NotificationsIcon from 'material-ui/lib/svg-icons/social/notifications'
import PersonOutlineIcon from 'material-ui/lib/svg-icons/social/person-outline'
import PersonIcon from 'material-ui/lib/svg-icons/social/person'
import AboutIcon from 'material-ui/lib/svg-icons/action/info-outline'
import FeedbackIcon from 'material-ui/lib/svg-icons/action/help-outline'
import BackIcon from 'material-ui/lib/svg-icons/navigation/arrow-back'
import { FlowHelpers } from '../../flowHelpers'
import { IconButton } from 'material-ui';
import LeftNavWrap from './LeftNav.jsx';

import FlatButton from 'material-ui/lib/flat-button'
import { config } from '../config'

import { getUserName } from 'meteor/carpool-view'


export default class TopMenu extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      menuOpen: false,
    }
  }

  render () {
    user = Meteor.user();
    //console.log("TopMenu user", user);
    avatar = user && user.profile && user.profile.avatar;
    //d("Return screen", this.props.returnScreen);

    return (
      <div>
        <div
          style={{
            // position: 'fixed',
            top: 0,
            height: this.props.height,
            width: this.props.width,
            background: this.props.background === 'blue' ? config.colors.main :
              (this.props.background === 'green' ? config.colors.green :
              (this.props.background ? this.props.background : config.colors.main)),
            color: 'white',
            borderRadius: 0,
            // zIndex: 2,
          }}
          zDepth={this.props.noShadow ? 0 : 1}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            height: '100%',
          }}>
            <div style ={{
              marginLeft: 12,
            }}>
              {this.props.innerScreen ? (
                this.props.returnScreen ? (
                  <IconButton onClick={() => FlowRouter.go(this.props.returnScreen)}>
                    <BackIcon color="white" />
                  </IconButton>
                ) : (
                  <BackButton />
                )
              ) : (
                <IconButton onClick={() => this.setState({ menuOpen: true })}>
                  <MenuIcon color="white" />
                </IconButton>
              )}
            </div>
            <div style={{
              marginLeft: 12,
              fontSize: 20,
            }} data-cucumber="screen-name">
              {this.props.title}
            </div>
          </div>
        </div>
        <LeftNavWrap
          open={this.state.menuOpen}
          onRequestChange={(menuOpen) => this.setState({ menuOpen })}
        />
      </div>
    )
  }
}
