import React from 'react'
import DesktopNavigation from './DesktopNavigation'
import { Paper, AppBar } from 'material-ui'
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import HomeIcon from 'material-ui/lib/svg-icons/action/home';
import IconButton from 'material-ui/lib/icon-button';
import NotifiactionsIcon from 'material-ui/lib/svg-icons/social/notifications'
import NotifiactionsNoneIcon from 'material-ui/lib/svg-icons/social/notifications-none'

export default class DesktopLayout extends React.Component {
  render () {
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
        <Paper style={{
          width: this.props.width,
          margin: '0px auto',
          marginTop: 25,
          padding: 15,
          minHeight: this.props.height - 200,
        }}>
          {this.props.children}
        </Paper>
      </div>
    )
  }
}
