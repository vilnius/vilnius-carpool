import React from 'react'
import { createContainer } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';

import TextField from 'material-ui/lib/text-field'
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import PlaceIcon from 'material-ui/lib/svg-icons/maps/place'
import BackButton from '../../components/layout/BackButton'
import Paper from 'material-ui/lib/paper'
import { config } from '../../config.js';

import { connect } from 'react-redux';
import { googleServices } from 'meteor/spastai:google-client';

import { updateFromLocation, updateToLocation } from '../../redux/modules/general/actions.js'

/*global google*/
/*global carpoolService*/

var autocompleteService = null;
googleServices.afterInit(function (){
  autocompleteService = new google.maps.places.AutocompleteService();

})
const getLocationSuggestions = (inputVal, callback) => {
  //console.log("Input val", inputVal, "")
  if(!autocompleteService) {
    console.warn("No AutocompleteService");
    return;
  }
  if (inputVal == '') {
    return callback([
      {description: 'Home'},
      {description: 'Work'},
    ])
  } else if (inputVal) {
    //d("Query", inputVal)
    autocompleteService.getQueryPredictions({
        input: inputVal,
        location: new google.maps.LatLng(54.67704, 25.25405),
        radius: 30000
      }, function(suggestions, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          const result = _(suggestions).map( (item)=> {
            //d("Terms length", item.terms.length)
            if(1 < item.terms.length) {
              //d("Concat address", item)
              item.terms.pop();
              const address = _(item.terms).pluck("value").join(", ");
              return {description: address}
            } else {
              //d("Pass description", item)
              return {description: item.description}
            }
          });
        // {
        //   description: "Paplaujos gatvė 3, Vilnius, Lietuva",
        //   id: "e658de75dc81451810db943c011acc28a7bc43c3",
        //   matched_substrings: Array[2],
        //   place_id: "ChIJJ1mrBjGU3UYRtmRv2aANbUM",
        //   terms: [{value: "Paplaujos gatvė"}, ...  "3", "Vilnius", "Lietuva"]
        //   reference: "CnRmAAAAIlCdKcgZ0xCnFTDaa2s11HNJ-ufv_YW6h1ZRg1Ent1…lxbAlg_7aONSzEeyNRbhoUmEVdwCxqrx5UQ9vDy7hIzG67tIE" …
        // }
          return callback(result);
        } else {
          //d("Query prediction error", status);
          return callback([]);
        }
    });
  } else {
    return callback([]);
  }
}


export default class LocationAutocomplete extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      suggestions: this.props.suggestions || []
    }
    //d("Favorites:", this.props.suggestions);
  }

  suggestionSelected(suggestion) {
    if(undefined == suggestion.latlng) {
      //d("Selected text", suggestion)
      carpoolService.geocode({address:suggestion.description},  (error, result)=> {
        if (!error && result.length > 0) {
            suggestion.latlng = result[0].geometry.location;
        }
        carpoolService.saveSelection(this.props.field, suggestion)
        this.props.onSelect(suggestion);
      });
    } else {
      //d("Selected geolocated text", suggestion)
      carpoolService.saveSelection(this.props.field, suggestion)
      this.props.onSelect(suggestion);
    }
    if (this.props.field === 'aLoc') {
      this.props.dispatch(updateFromLocation(suggestion.description));
    } else if (this.props.field === 'bLoc') {
      this.props.dispatch(updateToLocation(suggestion.description));
    }
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
          <TextField id="address" hintText="Search for places, addresses, stops, etc." autoFocus={true}
            hintStyle={{color: '#eee', fontSize: 12}} style={{marginLeft: 20, width: this.props.width - 75}}
            onChange={this.inputChanged.bind(this)} inputStyle={{color: 'white'}}
          />
        </Paper>
        <List>
          {this.state.suggestions.map((suggestion, i) => (
            [
              <ListItem
                id={"suggestion-"+i}
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


LocationAutocomplete.propTypes = {
  suggestions: React.PropTypes.array,
  field: React.PropTypes.string.isRequired,
  onSelect: React.PropTypes.func.isRequired,
  dispatch: React.PropTypes.func.isRequired,
};

const connectedLocationAutocomplete = connect()(LocationAutocomplete);

/*
 This component is loading data and is called from the other container (compoment which loads data)
  It shouldn't work as parent container loads list of notifications and then each item does subscribtion to trip.
  As these subscribtions are done in reactive computation, previous subscribtion should be stopped.

  However each NotificationCardContainer is running different object computation, so it has own subscribtion
  handler, thus doesn't stop other cards.
*/

export default LocationAutocompleteContainer = createContainer(({field, screen}) => {
  suggestions = carpoolService.favoriteSelections(field)
  //d("Suggestions in LocationAutocompleteContainer", suggestions)
  return {
    suggestions: suggestions,
    screen: screen
  }
}, connectedLocationAutocomplete);
