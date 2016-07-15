import React from 'react';
import { FlatButton, IconButton } from 'material-ui';
import NotificationsIcon from 'material-ui/lib/svg-icons/social/notifications'
import CarIcon from 'material-ui/lib/svg-icons/maps/directions-car'
import RequestsIcon from 'material-ui/lib/svg-icons/action/feedback'
import PersonIcon from 'material-ui/lib/svg-icons/social/person'
import FeedbackIcon from 'material-ui/lib/svg-icons/action/help-outline'
import { config } from '../../config.js';
import MenuIcon from 'material-ui/lib/svg-icons/navigation/menu'
import LeftNavWrap from './LeftNav.jsx';

/*global FlowRouter*/

// MUI theme start
// New mui theme required for button texts and their icons to be white
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import ThemeDecorator from 'material-ui/lib/styles/theme-decorator';

const navTheme = {
  palette: {
    textColor: '#fff',
  },
};

const WhiteFlatButton = ThemeDecorator(ThemeManager.getMuiTheme(navTheme))(FlatButton);
// MUI theme end
export default class DesktopNavigationBar extends React.Component {

  constructor (props) {
    super(props);

    this.state = {
      menuOpen: false,
    };
  }

  render () {
    return (
      <div style={{
        width: this.props.width,
        height: this.props.height,
        backgroundColor: config.colors.main,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        color: 'white',
      }}>
        <div style={{width: 275, marginLeft: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', fontSize: 20 }}>
          <IconButton rippleColor="white" onClick={() => this.setState({ menuOpen: true })}>
            <MenuIcon color="white" />
          </IconButton>
          {this.props.title}
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
        }}>
          <WhiteFlatButton style={{ marginRight: 7 }} label="Requests" icon={<RequestsIcon />} rippleColor="white"
            hoverColor="rgba(255, 255, 255, 0.18)"
            onClick={() => FlowRouter.go('RideRequests')}
          />
          <WhiteFlatButton style={{ marginRight: 7 }} label="Offers" icon={<CarIcon />} rippleColor="white"
            hoverColor="rgba(255, 255, 255, 0.18)"
            onClick={() => FlowRouter.go('RideOffers')}
          />
          <WhiteFlatButton style={{ marginRight: 7 }} label="My Trips" icon={<PersonIcon />} rippleColor="white"
            hoverColor="rgba(255, 255, 255, 0.18)"
            onClick={() => FlowRouter.go('YourRides')}
          />
          <WhiteFlatButton style={{ marginRight: 7 }} label="Notifications" icon={<NotificationsIcon />} rippleColor="white"
            hoverColor="rgba(255, 255, 255, 0.18)"
            onClick={() => FlowRouter.go('Notifications')}
          />
          <WhiteFlatButton style={{ marginRight: 7 }} label="Feedback" icon={<FeedbackIcon />} rippleColor="white"
            hoverColor="rgba(255, 255, 255, 0.18)"
            onClick={() => FlowRouter.go('Feedback')}
          />
        </div>
        <LeftNavWrap
          open={this.state.menuOpen}
          onRequestChange={(menuOpen) => this.setState({ menuOpen })}
        />
      </div>
    )
  }
}

DesktopNavigationBar.propTypes = {
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
  title: React.PropTypes.string.isRequired,
};
