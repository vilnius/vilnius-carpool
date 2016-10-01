import { connect } from 'react-redux'
import { createContainer } from 'meteor/react-meteor-data';
import { googleServices } from 'meteor/spastai:google-client';
import { _ } from 'meteor/underscore';
/* global carpoolService */
/*global google*/

var autocompleteService = null;
googleServices.afterInit(function (){
  autocompleteService = new google.maps.places.AutocompleteService();
})

const getLocationSuggestions = (inputVal, callback) => {
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
    autocompleteService.getQueryPredictions({
        input: inputVal,
        location: new google.maps.LatLng(54.67704, 25.25405),
        radius: 30000
      }, function(suggestions, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          const result = _(suggestions).map( (item)=> {
            if(1 < item.terms.length) {
              item.terms.pop();
              const address = _(item.terms).pluck("value").join(", ");
              return {description: address}
            } else {
              return {description: item.description}
            }
          });
          return callback(result);
        } else {
          return callback([]);
        }
    });
  } else {
    return callback([]);
  }
}

import LocationAutocompleteScreen from '../screens/LocationAutocomplete.jsx'

const connectedLocationAutocomplete = connect()(LocationAutocompleteScreen);

const LocationAutocompleteContainer = createContainer(({field, screen}) => {
  const suggestions = carpoolService.favoriteSelections(field)
  return {
    suggestions: suggestions,
    screen: screen,
    getLocationSuggestions,
  }
}, connectedLocationAutocomplete);

export default LocationAutocompleteContainer
