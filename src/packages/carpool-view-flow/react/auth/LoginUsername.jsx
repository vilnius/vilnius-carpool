import React from 'react'

import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';

export default class Login extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      emailError: null,
      passwordError: null,
    }
  }

  login () {
    console.log('Login with params', this.state);
    Meteor.loginWithPassword (this.state.email, this.state.password, (error)=> {
      if(error) {
        d('Log in ' + user + '  error: ' + error.reason);
        if (error.reason === 'User not found') {
          this.setState({
            emailError: 'User not found',
            passwordError: null,
          })
        } else if (error.reason === 'Incorrect password') {
          this.setState({
            emailError: null,
            passwordError: 'Incorrect password',
          })
        } else {
          alert('Error ' + error.reason)
        }
      } else {
        FlowRouter.go("RideOffers");
      }

    });
  }

  valueChanged (valueName, e) {
    this.setState({[valueName]: e.target.value})
  }

  render () {
    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <h2>Login</h2>
        <TextField id="inputUsername" className="mui-input" floatingLabelText="Email" value={this.state.email} onChange={this.valueChanged.bind(this, 'email')} errorText={this.state.emailError} />
        <TextField id="inputPassword" type="password" className="mui-input" floatingLabelText="Password" value={this.state.password} onChange={this.valueChanged.bind(this, 'password')} errorText={this.state.passwordError} />
        <div style={{marginTop: 25}}>
          <RaisedButton secondary label="Login" className="login" onClick={this.login.bind(this)} />
          <RaisedButton secondary label="Switch to register" onClick={() => flowControllerHelper.goToView('Register')} style={{marginLeft: 25}}/>
        </div>
      </div>
    )
  }
}
