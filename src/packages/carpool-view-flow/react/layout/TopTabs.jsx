import React from 'react';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import {FlowHelpers} from '../../flowHelpers'

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
};

export default class TopTabs extends React.Component {
  render () {
    return (
      <div style={{
        position: 'fixed',
        top: 50,
        width: window.innerWidth,
        zIndex: 1,
      }}>
        <Tabs value={this.props.selectedTabIndex}  >
          <Tab label="All" data-cucumber="all-trips" onClick={() => FlowHelpers.goExtendedPath({ ownTrips: 'all' })} value={0} />
          <Tab label="Your" data-cucumber="your-trips" onClick={() => FlowHelpers.goExtendedPath({ ownTrips: 'your' })} value={1} />
        </Tabs>
      </div>
    )
  }
}
