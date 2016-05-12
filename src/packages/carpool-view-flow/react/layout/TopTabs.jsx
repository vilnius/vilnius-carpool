import React from 'react';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';

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
        <Tabs
          value={this.props.selectedTabIndex}
        >
          {this.props.tabs.map((tab, i) => (
            <Tab label={tab.title}
              onClick={tab.onClick}
              value={i}
              key={i}
            />
          ))}
        </Tabs>
      </div>
    )
  }
}
