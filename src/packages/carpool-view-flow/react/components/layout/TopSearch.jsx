import React from 'react'
import { config } from '../../config'
import { FlowHelpers } from '../../../flowHelpers'
import DateTimePicker from '../common/DateTimePicker'
import ClearIcon from 'material-ui/lib/svg-icons/content/clear'

/*global carpoolService*/

const getStyles = (width) => ({
  searchField: {
    padding: 5,
    margin: '5px auto',
    background: config.colors.lightBlue,
    width: width * 0.8,
    height: 24,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchHint: {
    color: '#ddd',
    fontSize: 12,
    marginLeft: 3,
  },
  searchValue: {
    fontSize: 12,
    marginLeft: 5,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
})

export default class TopSearch extends React.Component {

  constructor(props) {
    super(props)
    //console.log("Create TopSearch with", props);
    this.state = {
      fromAddress : '...',
      toAddress: '...',
      pickerOpen: false,
      isDepartureDate: false,
      date: props.bTime
    }
  }

  componentWillMount () {
    this.mounted = true;
    //console.log("Will Mount TopSearch with", this.props);
    this.updatedLocations(this.props);
  }

  componentWillReceiveProps(nextProps) {
    //console.log("Will Update TopSearch with", nextProps);
    this.updatedLocations(nextProps);
  }

  componentWillUnmount () {
    this.mounted = false;
  }

  updatedLocations(props) {
    carpoolService.resolveLocation(props.from, props.fromAddress, (location) => {
      //console.log(props.from, props.fromAddress, "resolved -", location)
      if (this.mounted) {
        this.setState({fromAddress: location});
      }
    })
    carpoolService.resolveLocation(props.to, props.toAddress, (location) => {
      if (this.mounted) {
        this.setState({toAddress: location});
      }
    })
  }

  clearLocation (field, state, e) {
    const clear = {};
    if("aLoc" == field) {
      // To prevent currentLocation overide
      clear[field] = "";
    } else {
      clear[field] = undefined;
    }
    if("bTime" == field) {
      this.state[state] = undefined;
    } else {
      this.state[state] = '...';
    }
    FlowHelpers.goExtendedQuery(undefined, {}, clear);
    e.stopPropagation();
  }

  render () {
    const styles = getStyles(this.props.width)
    return (
      <div
        style={{
          // position: 'fixed',
          // top: this.props.topOffset,
          width: this.props.width,
          background: this.props.background === 'blue' ? config.colors.main :
            (this.props.background === 'green' ? config.colors.green :
            (this.props.background ? this.props.background : config.colors.main)),
          color: 'white',
          borderRadius: 0,
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 5,
          paddingBottom: 10,
          display: 'flex',
          flexDirection: 'column',
          // zIndex: 1,
          height: this.props.height,
        }}
        zDepth={this.props.noShadow ? 0 : 1}
      >
        <div style={styles.searchField} onClick={() => { FlowHelpers.goExtendedQuery('LocationAutocomplete', {screen: "RideOffers", field:"aLoc"}) }}>
          <div style={styles.searchHint}>from</div>
          <div style={styles.searchValue}>{this.props.fromAddress ? this.props.fromAddress : this.state.fromAddress}</div>
          <ClearIcon color="#fafafa" style={{marginLeft: 'auto'}} onClick={(e) => this.clearLocation('aLoc', 'fromAddress', e)} />
        </div>
        <div style={styles.searchField} onClick={() => { FlowHelpers.goExtendedQuery('LocationAutocomplete', {screen: "RideOffers", field:"bLoc"}) }}>
          <div style={styles.searchHint}>to</div>
          <div style={styles.searchValue}>{this.props.toAddress ? this.props.toAddress : this.state.toAddress}</div>
          <ClearIcon color="#fafafa" style={{marginLeft: 'auto'}} onClick={(e) => this.clearLocation('bLoc', 'toAddress', e)} />
        </div>
        <div style={styles.searchField} onClick={() => this.picker.openDateTimePicker(this.state.isDepartureDate, this.state.date)}>
          <div style={styles.searchHint}>{this.state.isDepartureDate ? 'depart at' : 'arrive by'}</div>
          <div style={styles.searchValue}>{this.state.date ? this.state.date.format('ddd, MMM D, H:mm') : "..."}</div>
          <ClearIcon color="#fafafa" style={{marginLeft: 'auto'}} onClick={(e) => this.clearLocation('bTime', 'date', e)} />
        </div>
        <DateTimePicker ref={(picker) => { this.picker = picker }} onDateSelected={({date, isDepartureDate}) => {
            FlowHelpers.goExtendedQuery(null, {}, {bTime: date.format("YYYYMMDDTHHmm")});
            this.setState({date, isDepartureDate})
        }} />
      </div>
    )
  }
}

TopSearch.propTypes = {
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  background: React.PropTypes.string,
  noShadow: React.PropTypes.bool,
  bTime: React.PropTypes.string,
  fromAddress: React.PropTypes.string,
  toAddress: React.PropTypes.string,
}
