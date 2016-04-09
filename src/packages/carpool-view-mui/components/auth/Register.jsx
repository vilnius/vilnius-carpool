import React from 'react'
import PageRoot from '../layout/PageRoot'
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';

export default class RegisterBase extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      password2: '',
    }
  }

  valueChanged (valueName, e) {
    this.setState({[valueName]: e.target.value})
  }

  register () {
    console.log('Register with params', this.state)
  }

  render () {
    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <h2>Register</h2>
        <TextField className="mui-input" floatingLabelText="Email" value={this.state.email} onChange={this.valueChanged.bind(this, 'email')} />
        <TextField type="password" className="mui-input" floatingLabelText="Password" value={this.state.password}
          onChange={this.valueChanged.bind(this, 'password')}
          errorText={this.state.password.length > 0 && this.state.password.length < 6 ? 'Password too short' : null}
        />
        <TextField type="password" className="mui-input" floatingLabelText="Password again" value={this.state.password2}
          onChange={this.valueChanged.bind(this, 'password2')}
          errorText={this.state.password2.length > 0 && this.state.password !== this.state.password2 ? 'Passwords don\'t match' : null}
        />
        <div style={{marginTop: 25}}>
          <RaisedButton secondary label="Register" onClick={this.register.bind(this)} />
          <RaisedButton secondary label="Switch to login" onClick={() => muiControllerHelper.goToView('MuiLogin')} style={{marginLeft: 25}}/>
        </div>
      </div>
    )
  }
}

Register = PageRoot(RegisterBase)
