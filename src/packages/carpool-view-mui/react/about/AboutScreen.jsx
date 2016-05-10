import React from 'react'
import wrapScreen from '../layout/wrapScreen'

export default class About extends React.Component {
  render () {
    return (
      <div>
        TODO About
      </div>
    )
  }
}

AboutScreen = wrapScreen(About, {
  title: 'About',
  innerScreen: true,
})
