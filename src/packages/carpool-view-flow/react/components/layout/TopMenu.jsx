import React from 'react'
import BackButton from './BackButton'
import MenuIcon from 'material-ui/lib/svg-icons/navigation/menu'
import BackIcon from 'material-ui/lib/svg-icons/navigation/arrow-back'
import { IconButton } from 'material-ui';
import LeftNavWrap from './LeftNav.jsx';
import { config } from '../../config'
import { StyleSheet, css } from 'aphrodite'

/*global Meteor*/
/*global FlowRouter*/

const styles = StyleSheet.create({
  menuWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
})

export default class TopMenu extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      menuOpen: false,
    }
  }

  render () {
    const user = Meteor.user();
    //console.log("TopMenu user", user);
    const avatar = user && user.profile && user.profile.avatar;
    //d("Return screen", this.props.returnScreen);

    return (
      <div>
        <div
          style={{
            top: 0,
            height: this.props.height,
            width: this.props.width,
            background: this.props.background === 'blue' ? config.colors.main :
              (this.props.background === 'green' ? config.colors.green :
              (this.props.background ? this.props.background : config.colors.main)),
            color: 'white',
            borderRadius: 0,
          }}
          zDepth={this.props.noShadow ? 0 : 1}
        >
          <div className={css(styles.menuWrap)}>
            <div style={{
              marginLeft: 12,
            }}>
              {this.props.innerScreen ? (
                this.props.returnScreen ? (
                  <IconButton onClick={() => FlowRouter.go(this.props.returnScreen)}>
                    <BackIcon color="white" />
                  </IconButton>
                ) : (
                  <BackButton />
                )
              ) : (
                <IconButton onClick={() => this.setState({ menuOpen: true })}>
                  <MenuIcon color="white" />
                </IconButton>
              )}
            </div>
            <div
              style={{
                marginLeft: 12,
                fontSize: 20,
              }}
              data-cucumber="screen-name"
            >
              {this.props.title}
            </div>
          </div>
        </div>
        <LeftNavWrap
          open={this.state.menuOpen}
          onRequestChange={(menuOpen) => this.setState({ menuOpen })}
          avatar={avatar}
        />
      </div>
    )
  }
}

TopMenu.propTypes = {
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  title: React.PropTypes.string.isRequired,
  innerScreen: React.PropTypes.bool,
  returnScreen: React.PropTypes.string,
  noShadow: React.PropTypes.bool,
  background: React.PropTypes.string, // Sets background color of top menu
}
