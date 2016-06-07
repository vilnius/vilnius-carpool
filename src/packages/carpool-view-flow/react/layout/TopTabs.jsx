import React from 'react';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import {FlowHelpers} from '../../flowHelpers'
import Paper from 'material-ui/lib/paper'

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
      <Paper style={{
        position: 'fixed',
        top: 50,
        width: window.innerWidth,
        zIndex: 1,
      }}>
        <Tabs value={this.props.selectedTabIndex}  >
          <Tab label="Rides" data-cucumber="your-rides" onClick={() => FlowHelpers.goExtendedQuery("YourRides", {})} value={0} />
          <Tab label="Drives" data-cucumber="your-drives" onClick={() => FlowHelpers.goExtendedQuery("YourDrives", {})} value={1} />
        </Tabs>
      </Paper>
    )
  }
}
