import React from 'react'
import { config } from '../config'
import Paper from 'material-ui/lib/paper';
import { css, StyleSheet } from 'aphrodite';
/*global Meteor*/
/*global FlowRouter*/
/*global flowControllerHelper*/

const styles = StyleSheet.create({
  screenWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: config.colors.main,
    color: 'white',
  }
})

export default class NotLoggedInLanding extends React.Component {
  render () {
    const width = this.props.width
    const height = this.props.height
    if(Meteor.user()) {
      FlowRouter.go("/newRide");
      return null;
    } else return (
      <div data-cucumber="login-screen" style={{ height: height }} className={css(styles.screenWrap)}>
        <div style={{marginTop: height / 6, textAlign:'center'}}><img src="/img/app_icon.png" width="100px"></img></div>
        <div style={{marginTop: 30, textAlign: 'center'}}>Welcome to<br />Vilnius Carpooling Serice</div>
        <Paper style={{marginTop: 50, width: width * 0.7, height: 45, display: 'flex', flexDirection: 'row', alignItems: 'center', background: '#3B5A9A', color: 'white'}}
          onClick={() => {
            //console.log("G+ login")
            Meteor.loginWithFacebook({requestPermissions:["public_profile", "email"]}, (error) => {
              if(error)
                console.log('Log in with Facebook error: ', error.reason || 'Unknown error');
              else {
                console.log("Logged in Facebook user:", Meteor.user());
                FlowRouter.go("NewRide");
              }
            })
          }}
        >
          <div style={{marginLeft: 20}}>f</div>
          <div style={{marginLeft: 'auto', marginRight: 'auto'}}>Sign in with Facebook</div>
        </Paper>
        <Paper style={{marginTop: 25, width: width * 0.7, height: 45, display: 'flex', flexDirection: 'row', alignItems: 'center', background: '#DC4E41', color: 'white'}}
          onClick={() => {
            //console.log("G+ login")
            Meteor.loginWithGoogle({requestPermissions:["https://www.googleapis.com/auth/userinfo.email"]}, (error) => {
              if(error)
                console.log('Log in with google error: ', error.reason || 'Unknown error');
              else {
                console.log("Logged in google user:", Meteor.user());
                FlowRouter.go("NewRide");
              }
            })
          }}
        >
          <div style={{marginLeft: 20}}>G+</div>
          <div style={{marginLeft: 'auto', marginRight: 'auto'}}>Sign in with Google</div>
        </Paper>
        <div style={{marginTop: 30, cursor: 'pointer'}}
          onClick={() => flowControllerHelper.goToView('LoginUsername')}
        >
          or login with username
        </div>
        <div style={{marginTop: 'auto', marginBottom: 20}}>Courtesy of cfv</div>
      </div>
    )
  }
}

NotLoggedInLanding.propTypes = {
  width: React.PropTypes.number,
  height: React.PropTypes.number,
}
