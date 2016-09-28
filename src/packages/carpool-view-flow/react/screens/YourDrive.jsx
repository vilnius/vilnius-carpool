import React from 'react'
import RaisedButton from 'material-ui/lib/raised-button';
import { StyleSheet, css } from 'aphrodite'

import TripInfoWithMap from '../components/ride-info/TripInfoWithMap.jsx'
import Loader from '../components/common/Loader'

const styles = StyleSheet.create({
  screenWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
})

export default class YourDrive extends React.Component {

  render () {
    const {progress, stops, itinerary, user, isRequested} = this.props;

    if (100 != progress.getProgress()) {
      return (
        <section style={{height: "100%", marginTop: 25}}>
          <Loader />
        </section>
      );
    } else {
      const bottomPartHeight = 65

      return (
        <div data-cucumber="screen-your-drive" className={css(styles.screenWrap)}>
          <TripInfoWithMap
            width={this.props.width}
            height={this.props.height - bottomPartHeight}
            itinerary={itinerary}
            user={user}
          />
          <RaisedButton primary style={{width: window.innerWidth * 0.9, borderRadius: 5}}
            label={isRequested ? "Withdraw confirmation" : "Offer ride"}
            onClick={() => { alert('Modal with timechoice coming') }}
          />
        </div>
      )
    }
  }
}

YourDrive.propTypes = {
  progress: React.PropTypes.object,
  stops: React.PropTypes.array,
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
  user: React.PropTypes.object,
  isRequested: React.PropTypes.object,
  itinerary: React.PropTypes.array,
};
