import React from 'react'
import { LeftNav } from 'material-ui'
import {List, ListItem} from 'material-ui';
import ActionFlightTakeoff from 'material-ui/lib/svg-icons/action/flight-takeoff';
import HardwareVideogameAsset from 'material-ui/lib/svg-icons/hardware/videogame-asset';
import RemoveRedEye from 'material-ui/lib/svg-icons/image/remove-red-eye';

export default class MobileNavigation extends React.Component {
  render () {
    return (
          <LeftNav
            docked={false}
            open={this.props.open}
            onRequestChange={this.props.onRequestChangeLeftNav}
          >
            <h3 style={{textAlign: 'center'}}>
              Username
            </h3>
            <List>
              <ListItem primaryText="Trip Form" onTouchTap={() => {
                console.log('TODO Should navigate')
                this.props.onRequestChangeLeftNav(false)
              }} leftIcon={<ActionFlightTakeoff />}/>
              <ListItem primaryText="User Settings" onTouchTap={() => {
                console.log('TODO Should navigate')
                this.props.onRequestChangeLeftNav(false)
              }} leftIcon={<HardwareVideogameAsset />} />
              <ListItem primaryText="Examples" onTouchTap={() => {
                console.log('TODO Should navigate')
                this.props.onRequestChangeLeftNav(false)
              }} leftIcon={<RemoveRedEye />} />
            </List>
          </LeftNav>
        )
  }
}
