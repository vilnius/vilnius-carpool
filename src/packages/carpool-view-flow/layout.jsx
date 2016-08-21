import React from 'react'
import { muiTheme } from './react/config'
import ThemeManager from 'material-ui/lib/styles/theme-manager'
import { createContainer } from 'meteor/react-meteor-data'
import Loader from './react/components/common/Loader'
import FloatingNewRideButton from './react/components/layout/FloatingNewTripButton.jsx'
import FloatingFeedbackButton from './react/components/layout/FloatingFeedbackButton.jsx'
import { Paper } from 'material-ui'
import DesktopNavigationBar from './react/components/layout/DesktopNavigationBar.jsx';
import GoogleMap from './react/components/map/GoogleMap'
/*global userSubs*/

import { Provider } from 'react-redux';
import store from './react/redux/store';

export class MainLayout extends React.Component {
  constructor (props) {
    super(props)

    const resizeListener = () => {
      this.setState(this.calcAppSize())
    }

    window.addEventListener('resize', resizeListener)
    window.addEventListener('orientationchange', resizeListener)

    this.state = {
      ...this.calcAppSize(),
      resizeListener,
    }
  }

  getChildContext () {
    return {
      muiTheme: ThemeManager.getMuiTheme(muiTheme),
    }
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.state.resizeListener)
    window.removeEventListener('orientationchange', this.state.resizeListener)
  }

  calcAppSize () {
    const ww = window.innerWidth;
    const wh = window.innerHeight;

    return {
      ww,
      wh,
      appWidth: ww > 1024 ? 500 : ww,
      appHeight: ww <= 1024 ? wh : wh - 50,
      isMobile: ww <= 1024,
    }
  }

  renderElement(element, extraParams = {}) {
    return !element ? null :
      React.cloneElement(element, {
        width: this.state.appWidth,
        isMobile: this.state.isMobile,
        ...extraParams,
      })
  }

  renderMobile () {
    const topMenuHeight = this.props.topMenu ? 50 : 0;
    const topSearchHeight = this.props.topSearch ? 115 : 0;
    const topFilterHeight = this.props.topFilter ? 48 : 0; // Looks bad if not 48 at the moment
    const bottomMenuHeight = this.props.bottomMenu ? 64 : 0;
    const contentHeight = this.state.appHeight - (topMenuHeight + topSearchHeight + topFilterHeight + bottomMenuHeight);

    // const iconSideOffset = (this.state.ww - this.state.appWidth) / 2;
    const leftIconSideOffset = 0;
    const rightIconSideOffset = this.state.isMobile ? 0 : this.state.ww - this.state.appWidth;
    const bottomOffset = 8;
    return (
      <Provider store={store}>
        <div>
          {this.props.topMenu || this.props.topFilter || this.props.topSearch ? (
            <header>
              <Paper>
                {this.renderElement(this.props.topMenu, { height: topMenuHeight })}
                {this.renderElement(this.props.topFilter, { height: topFilterHeight })}
                {this.renderElement(this.props.topSearch, { height: topSearchHeight })}
              </Paper>
            </header>
          ) : null}
          <main style={{
            overflowX: 'scroll',
            width: this.state.appWidth,
            height: contentHeight,
          }}>
            {this.renderElement(this.props.content, { height: contentHeight })}
          </main>
          {this.props.bottomMenu ? (
            <bottom>
              {this.renderElement(this.props.bottomMenu, { height: bottomMenuHeight, bottomOffset: bottomOffset })}
            </bottom>
          ) : null}
          {this.props.renderNewTripButton ?
            <FloatingNewRideButton isMobile={this.state.isMobile}
              sideOffset={rightIconSideOffset} bottomOffset={bottomOffset}
            /> : null
          }
          {/*
            this.props.renderFeedbackButton ?
            <FloatingFeedbackButton isMobile={this.state.isMobile}
              sideOffset={leftIconSideOffset} bottomOffset={bottomOffset}
            /> : null
          */}
        </div>
      </Provider>
    )
  }

  render () {
    if (this.state.isMobile) {
      return this.renderMobile()
    }

    const title = this.props.topMenu ? this.props.topMenu.props.title : null;

    const topMenuHeight = this.props.topMenu ? 50 : 0;
    const topSearchHeight = this.props.topSearch ? 115 : 0;
    const topFilterHeight = this.props.topFilter ? 48 : 0; // Looks bad if not 48 at the moment
    const bottomMenuHeight = this.props.bottomMenu ? 64 : 0;
    const contentHeight = this.state.appHeight - (topMenuHeight + topSearchHeight + topFilterHeight + bottomMenuHeight);

    const rightIconSideOffset = this.state.isMobile ? 0 : this.state.ww - this.state.appWidth;
    const bottomOffset = 8;

    return (
      <Provider store={store}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
        }}>
          {title ? <DesktopNavigationBar width={this.state.ww} height={50} title={title} /> : null}
          <div style={{
            display: 'flex',
            flexDirection: 'row',
          }}>
            <div
              style={{
                width:this.state.appWidth,
                height: this.state.appHeight,
              }}
            >
              {this.props.topMenu || this.props.topFilter || this.props.topSearch ? (
                <header>
                  {this.renderElement(this.props.topFilter, { height: topFilterHeight })}
                  {this.renderElement(this.props.topSearch, { height: topSearchHeight })}
                </header>
              ) : null}
              <main>
                {this.renderElement(this.props.content, { height: contentHeight })}
              </main>
              {this.props.renderNewTripButton ?
                <FloatingNewRideButton isMobile={this.state.isMobile}
                  sideOffset={rightIconSideOffset} bottomOffset={bottomOffset}
                /> : null}
            </div>
            <div style={{
              width: this.state.ww - this.state.appWidth,
              height: this.state.appHeight,
            }}>
              <GoogleMap />
            </div>
          </div>
        </div>
      </Provider>
    )
    // Needs to render <= 1024, >1024, >1280
  }
}

MainLayout.childContextTypes = {
  muiTheme: React.PropTypes.object,
}

MainLayout.propTypes = {
  topMenu: React.PropTypes.element,
  topFilter: React.PropTypes.element,
  topSearch: React.PropTypes.element,
  bottomMenu: React.PropTypes.element,
  content: React.PropTypes.element.isRequired,
  renderNewTripButton: React.PropTypes.bool,
  renderFeedbackButton: React.PropTypes.bool,
}

export const SecureLayout = createContainer((props) => {
  const isLoading = !userSubs.ready();
  return {isLoading, props};
}, ({isLoading, props}) => {
  if (isLoading) {
    return (
      <section style={{height: "100%", marginTop: 25}}>
        <Loader />
      </section>
    )
  } else {
    return <MainLayout {...props} />
  }
})
