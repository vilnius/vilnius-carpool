import React from 'react'
import wrapScreen from '../layout/wrapScreen'

export default class Profile extends React.Component {
  render () {
    return (
      <div>
        TODO Profile
      </div>
    )
  }
}

ProfileScreen = wrapScreen(Profile, {
  title: 'Profile',
  innerScreen: true,
})
