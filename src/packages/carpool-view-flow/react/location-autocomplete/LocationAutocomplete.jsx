import React from 'react'
import TextField from 'material-ui/lib/text-field'
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import PlaceIcon from 'material-ui/lib/svg-icons/maps/place'
import BackButton from '../layout/BackButton'
import Paper from 'material-ui/lib/paper'
import { config } from '../config'

import { googleServices } from 'meteor/spastai:google-client';

var autocompleteService = null;
googleServices.afterInit(function (){
  autocompleteService = new google.maps.places.AutocompleteService();
})
const getLocationSuggestions = (inputVal, callback) => {
  if (inputVal == '') {
    callback([
      {description: 'Home'},
      {description: 'Work'},
    ])
  } else if (autocompleteService && inputVal) {
    autocompleteService.getQueryPredictions({
        input: inputVal,
        location: new google.maps.LatLng(54.67704, 25.25405),
        radius: 30000
      }, function(suggestions, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          callback(suggestions);
        } else {
          return callback([]);
        }
    });
  } else {
    callback([]);
  }
}

export default class LocationAutocomplete extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      suggestions: [],
    }
    /*
    getLocationSuggestions('', (suggestions) => {
      this.setState({suggestions})
    })
    */
  }

  suggestionSelected(suggestion) {
    //console.log("Selected text", suggestion)
    googleServices.getGeocoder().geocode({address:suggestion.description},  (error, result)=> {
      if (!error && result.length > 0) {
          suggestion.latlng = result[0].geometry.location;
      }
      this.props.onSelect(suggestion);
    });
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
                primaryText={suggestion.description}
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
