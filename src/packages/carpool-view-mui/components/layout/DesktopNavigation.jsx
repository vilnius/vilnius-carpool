import React from 'react'
import { FlatButton, Paper, DropDownMenu, MenuItem } from 'material-ui'

const buttonStyles = {
  borderBottom: '1px solid #00bcd4',
  borderTop: '1px solid #00bcd4',
  borderRadius: 10,
  margin: 10,
  marginTop: 12,
}

class DesktopNavigation extends React.Component {
  render () {
    return (
      <Paper>
        <div style={{
          width: '100%',
          height: 60,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <h1 style={{padding: 15}}>Carpool</h1>
          <FlatButton style={buttonStyles} label="Home" onClick={() => {}} />
          <FlatButton style={buttonStyles} label="Examples" onClick={() => {}} />
          <div style={{marginLeft: 'auto', marginRight: 2}}>
            <DropDownMenu value={this.props.language} onChange={(e, ind, value) => {console.log('Language changed', value)}}>
              <MenuItem value="en" primaryText="EN"/>
              <MenuItem value="lt" primaryText="LT"/>
            </DropDownMenu>
          </div>
        </div>
      </Paper>
    )
  }
}

export default DesktopNavigation
