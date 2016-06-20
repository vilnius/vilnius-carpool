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
        width: this.props.width,
        height: this.props.height,
      }}>
        <Tabs value={this.props.selectedTabIndex}
          style={{ height: this.props.height }}
        >
          <Tab label="Rides" data-cucumber="your-rides" onClick={() => FlowHelpers.goExtendedQuery("YourRides", {})} value={0} />
          <Tab label="Drives" data-cucumber="your-drives" onClick={() => FlowHelpers.goExtendedQuery("YourDrives", {})} value={1} />
        </Tabs>
      </div>
    )
  }
}
