import React from 'react'
import Avatar from 'material-ui/lib/avatar';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import CheckCircleIcon from 'material-ui/lib/svg-icons/action/check-circle'

export default class MatchingTrips extends React.Component {
  render () {
    if (!this.props.matchingTrips.length) {
      return (
        <div>Currently there are no matching trips</div>
      )
    }

    return (
      <List subheader="Matching Trips">
        {this.props.matchingTrips.map((person) => (
          <ListItem
            primaryText={person.name}
            leftAvatar={<Avatar src={person.imageSource} />}
            rightIcon={<CheckCircleIcon onClick={() => {console.log('Should accept person', person)}} />}
          />
        ))}
      </List>
    )
  }
}
