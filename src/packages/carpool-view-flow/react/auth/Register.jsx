import React from 'react'
import RaisedButton from 'material-ui/lib/raised-button';
import { Accounts } from 'meteor/accounts-base'
import { TextField, Snackbar } from 'material-ui'
import { StyleSheet, css } from 'aphrodite'
/*global FlowRouter*/
/*global flowControllerHelper*/

const styles = StyleSheet.create({
  screenWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
})

export default class Register extends React.Component {

  constructor (props) {
    super(props)

    this.register = this.register.bind(this);

    this.state = {
      email: '',
      password: '',
      password2: '',
      errorSnackbarMessage: '',
      errorSnackbarOpen: false,
    }
  }

  valueChanged (valueName, e) {
    this.setState({[valueName]: e.target.value})
  }

  register () {
    //console.log('Register with params', this.state)
    Accounts.createUser(this.state, (err)=>{
      if(err) {
        this.showErrorSnackbar(err.reason);
      } else {
        FlowRouter.go("RideOffers");
      }
    });
  }

  showErrorSnackbar(message) {
    //d("Showing error message", message)
    this.setState({
      errorSnackbarMessage: message,
      errorSnackbarOpen: true
    });
  }

  render () {
    return (
      <div className={css(styles.screenWrap)}>
        <h2>Register</h2>
        <TextField className="mui-input" floatingLabelText="Email" value={this.state.email} onChange={(e) => this.setState({ email: e.target.value })} />
        <TextField type="password" className="mui-input" floatingLabelText="Password" value={this.state.password}
          onChange={(e) => this.setState({ password: e.target.value })}
          errorText={this.state.password.length > 0 && this.state.password.length < 6 ? 'Password too short' : null}
        />
        <TextField type="password" className="mui-input" floatingLabelText="Password again" value={this.state.password2}
          onChange={(e) => this.setState({ password2: e.target.value })}
          errorText={this.state.password2.length > 0 && this.state.password !== this.state.password2 ? 'Passwords don\'t match' : null}
        />
        <div style={{marginTop: 25}}>
          <RaisedButton secondary label="Register" onClick={this.register} />
          <RaisedButton secondary label="Switch to login" onClick={() => flowControllerHelper.goToView('LoginUsername')} style={{marginLeft: 25}} />
        </div>
        <Snackbar
          open={this.state.errorSnackbarOpen}
          message={this.state.errorSnackbarMessage}
          autoHideDuration={4000}
          onRequestClose={() => this.closeErrorSnackbar()}
        />
      </div>
    )
  }
}
