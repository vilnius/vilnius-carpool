import React from 'react'

import TextField from 'material-ui/lib/text-field'
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import PlaceIcon from 'material-ui/lib/svg-icons/maps/place'
import Paper from 'material-ui/lib/paper'
import { StyleSheet, css } from 'aphrodite'

import BackButton from '../components/layout/BackButton'
import { config } from '../config.js';
import { updateFromLocation, updateToLocation } from '../redux/modules/general/actions.js'

/*global carpoolService*/

const styles = StyleSheet.create({
  screenWrap: {
    display: 'flex',
    flexDirection: 'column',
  },
  headerWrap: {
    background: config.colors.main,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
});

export default class LocationAutocomplete extends React.Component {
  constructor (props) {
    super(props)

    this.inputChanged = this.inputChanged.bind(this)
    this.suggestionSelected = this.suggestionSelected.bind(this)

    this.state = {
      suggestions: this.props.suggestions || [],
      defaultSuggestions: true,
      completedTypingTimeout: null,
    }
  }

  suggestionSelected(suggestion) {
    if(undefined == suggestion.latlng) {
      carpoolService.geocode({address:suggestion.description},  (error, result)=> {
        if (!error && result.length > 0) {
            suggestion.latlng = result[0].geometry.location;
        }
        this.props.onSelect(suggestion);
      });
    } else {
      this.props.onSelect(suggestion);
    }
    if (this.props.field === 'aLoc') {
      this.props.dispatch(updateFromLocation(suggestion.description, suggestion.loc));
    } else if (this.props.field === 'bLoc') {
      this.props.dispatch(updateToLocation(suggestion.description, suggestion.loc));
    }
  }

  inputChanged (e) {
    const addressToSearch = e.target.value;
    const completedTypingTimeout = setTimeout(() => {
      this.props.getLocationSuggestions(addressToSearch, (suggestions) =>
        this.setState({
          suggestions,
          defaultSuggestions: false,
        }))
    }, 100)
    clearTimeout(this.state.completedTypingTimeout)
    this.setState({
      completedTypingTimeout
    })
  }

  render () {
    return (
      <div
        className={css(styles.screenWrap)}
        data-cucumber="location-autocomplete-form"
        data-cucumber-default-suggestions={this.state.defaultSuggestions}
      >
        <Paper className={css(styles.headerWrap)}>
          <div style={{marginLeft: 10}}>
            <BackButton />
          </div>
          <TextField id="address" hintText="Search for places, addresses, stops, etc." autoFocus
            data-cucumber="address-input"
            hintStyle={{color: '#eee', fontSize: 12}} style={{marginLeft: 20, width: this.props.width - 75}}
            onChange={this.inputChanged}
            inputStyle={{color: 'white'}}
          />
        </Paper>
        <List>
          {this.state.suggestions.map((suggestion, i) => (
            [
              <ListItem
                data-cucumber={"suggestion-"+i}
                leftIcon={<PlaceIcon />}
                primaryText={suggestion.description}
                onClick={() => this.suggestionSelected(suggestion)}
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
  width: React.PropTypes.number.isRequired,
  suggestions: React.PropTypes.array,
  field: React.PropTypes.string.isRequired,
  onSelect: React.PropTypes.func.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  getLocationSuggestions: React.PropTypes.func.isRequired,
};
