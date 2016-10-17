import React from 'react';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import {FlowHelpers} from '../../../flowHelpers'

const TopTabs = ({ width, height, selectedTabIndex }) => (
  <div style={{
    width: width,
    height: height,
  }}>
    <Tabs value={selectedTabIndex}
      style={{ height: height }}
    >
      <Tab label="Rides" data-cucumber="your-rides" onClick={() => FlowHelpers.goExtendedQuery("YourRides", {})} value={0} />
      <Tab label="Drives" data-cucumber="your-drives" onClick={() => FlowHelpers.goExtendedQuery("YourDrives", {})} value={1} />
    </Tabs>
  </div>
)

TopTabs.propTypes = {
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  selectedTabIndex: React.PropTypes.number.isRequired,
}

export default TopTabs
