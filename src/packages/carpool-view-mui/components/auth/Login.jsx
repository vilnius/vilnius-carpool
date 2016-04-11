import React from 'react'
import PageRoot from '../layout/PageRoot'
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';

export default class LoginBase extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: '',
    }
  }

  login () {
    console.log('Login with params', this.state)
  }

  valueChanged (valueName, e) {
    this.setState({[valueName]: e.target.value})
  }

  render () {
    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <h2>Login</h2>
        <TextField className="mui-input" floatingLabelText="Email" value={this.state.email} onChange={this.valueChanged.bind(this, 'email')} />
        <TextField type="password" className="mui-input" floatingLabelText="Password" value={this.state.password} onChange={this.valueChanged.bind(this, 'password')} />
        <div style={{marginTop: 25}}>
          <RaisedButton secondary label="Login" onClick={this.login.bind(this)} />
          <RaisedButton secondary label="Switch to register" onClick={() => muiControllerHelper.goToView('MuiRegister')} style={{marginLeft: 25}}/>
        </div>
      </div>
    )
  }
}

Login = PageRoot(LoginBase)
