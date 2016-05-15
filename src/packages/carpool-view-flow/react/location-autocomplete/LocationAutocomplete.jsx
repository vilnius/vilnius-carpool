import React from 'react'
import TextField from 'material-ui/lib/text-field'
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import PlaceIcon from 'material-ui/lib/svg-icons/maps/place'
import BackButton from '../layout/BackButton'
import Paper from 'material-ui/lib/paper'
import { config } from '../config'

const getLocationSuggestions = (searchInput, cb) => {
  setTimeout(() => {
    if (searchInput == '') {
      cb([
        {title: 'Home'},
        {title: 'Work'},
      ])
    } else {
      cb([
        {title: searchInput},
        {title: searchInput + searchInput},
        {title: searchInput + searchInput + searchInput},
        {title: searchInput + searchInput + searchInput + searchInput},
        {title: searchInput + searchInput + searchInput + searchInput + searchInput},
      ])
    }
  })
}

export default class LocationAutocomplete extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      suggestions: [],
    }
    getLocationSuggestions('', (suggestions) => {
      this.setState({suggestions})
    })
  }

  suggestionSelected(suggestion) {
    this.props.onSelect(suggestion)
  }

  inputChanged (e) {
    getLocationSuggestions(e.target.value, (suggestions) => this.setState({suggestions}))
  }

  render () {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Paper style={{background: config.colors.main, width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <div style={{marginLeft: 10}}>
            <BackButton />
          </div>
          <TextField hintText="Search for places, addresses, stops, etc."
            hintStyle={{color: '#eee', fontSize: 12}} style={{marginLeft: 20, width: window.innerWidth - 75}}
            onChange={this.inputChanged.bind(this)} inputStyle={{color: 'white'}}
          />
        </Paper>
        <List>
          {this.state.suggestions.map((suggestion, i) => (
            [
              <ListItem
                leftIcon={<PlaceIcon />}
                primaryText={suggestion.title}
                onClick={this.suggestionSelected.bind(this, suggestion)}
              />,
              <Divider />,
            ]
          ))}
        </List>
      </div>
    )
  }
}
