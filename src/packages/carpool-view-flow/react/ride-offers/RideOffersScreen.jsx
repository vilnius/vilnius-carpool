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

const names = ['Ana', 'Bob', 'Caithlyn', 'David', 'Erik', 'Frank',
  'George', 'Harry']

const rideOffers = names.map((name, i) => ({
  name,
  image: 'http://lorempixel.com/200/200/people/' + i,
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

export default class RideOffers extends React.Component {
  render () {
    console.log("Rendering RideOffers")
    return (
      <RidesList rides={rideOffers} />
    )
  }
}

RideOffersScreen = wrapScreen(RideOffers, {
  newRideButton: true,
  title: 'Ride Offers',
})
