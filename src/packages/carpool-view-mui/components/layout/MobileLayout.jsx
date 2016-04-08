import React from 'react'
import MobileNavigation from './MobileNavigation'
import { AppBar } from 'material-ui'
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import HomeIcon from 'material-ui/lib/svg-icons/action/home';
import IconButton from 'material-ui/lib/icon-button';
import NotifiactionsIcon from 'material-ui/lib/svg-icons/social/notifications'
import NotifiactionsNoneIcon from 'material-ui/lib/svg-icons/social/notifications-none'

export default class MobileLayout extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      navOpen: false,
    }
  }

  openNavigation () {
    this.setState({
      navOpen: true,
    })
  }

  handleChangeRequestLeftNav (isOpen) {
    this.setState({
      navOpen: isOpen,
    })
  }

  changeLanguage () {

  }

  render () {
    const language = 'en'
    return (
      <div>
        <AppBar
          title="Carpool"
          iconElementLeft={
            <div >
              <IconButton onClick={() => {muiControllerHelper.goToView('MuiLanding')}}><HomeIcon color="#fff"/></IconButton>
            </div>
          }
          iconElementRight={
            <div>
              <DropDownMenu labelStyle={{color: 'white'}} value={'en'} onChange={(e, ind, value) => {}}>
                <MenuItem value="en" primaryText="EN"/>
                <MenuItem value="lt" primaryText="LT"/>
              </DropDownMenu>
              <IconButton onClick={() => {muiControllerHelper.goToView('MuiNotifications')}}><NotifiactionsIcon color="#fff"/></IconButton>
            </div>
          }
        />
        <MobileNavigation open={this.state.navOpen} onRequestChangeLeftNav={this.handleChangeRequestLeftNav.bind(this)} />
        {this.props.children}
      </div>
    )
  }
}
