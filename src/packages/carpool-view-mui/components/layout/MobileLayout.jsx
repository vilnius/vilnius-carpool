import React from 'react'
import MobileNavigation from './MobileNavigation'
import { AppBar } from 'material-ui'
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import MenuIcon from 'material-ui/lib/svg-icons/navigation/menu';
import IconButton from 'material-ui/lib/icon-button';

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
              <IconButton onClick={this.openNavigation.bind(this)}><MenuIcon color="#fff"/></IconButton>
            </div>
          }
          iconElementRight={
            <DropDownMenu labelStyle={{color: 'white'}} value={language} onChange={(e, ind, value) => this.changeLanguage(value)}>
              <MenuItem value="en" primaryText="EN"/>
              <MenuItem value="lt" primaryText="LT"/>
            </DropDownMenu>
          }
        />
        <MobileNavigation open={this.state.navOpen} onRequestChangeLeftNav={this.handleChangeRequestLeftNav.bind(this)} />
        {this.props.children}
      </div>
    )
  }
}
