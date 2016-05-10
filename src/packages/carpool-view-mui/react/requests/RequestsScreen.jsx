import React from 'react'
import wrapScreen from '../layout/wrapScreen'
import RidesList from '../components/RidesList'
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import ContentAdd from 'material-ui/lib/svg-icons/content/add';
import SearchIcon from 'material-ui/lib/svg-icons/action/search';
// import HamburgerMenuButton from './components/HamburgerMenuButton'
import RepeatingDays from '../components/ReccuringDays'
import { config } from '../config'

function getRandomBool() {
  return Math.random() < 0.5
}

const names = ['Tomas', 'Andrius', 'Lukas']

const rideRequests = names.map((name, i) => ({
  name,
  image: 'http://lorempixel.com/200/200/people/' + Math.round(Math.random() * 9),
  isReccuring: getRandomBool(),
  reccuringDays: [getRandomBool(), getRandomBool(), getRandomBool(),
    getRandomBool(), getRandomBool(), getRandomBool(), getRandomBool()],
  date: `May ${Math.round(Math.random() * 30)}, 2016`,
  from: 'Gatves g. 12',
  fromTime: '8:35',
  to: 'Prospekto pr. 57',
  toTime: '9:15',
  toTimeApproximate: true,
}))

export default class Requests extends React.Component {
  render () {
    return (
      <RidesList rides={rideRequests} />
    )
  }
}

RequestsScreen = wrapScreen(Requests, {
  newRideButton: true,
  title: 'Ride requests',
})
