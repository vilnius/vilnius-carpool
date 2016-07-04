import React from 'react'
import { muiTheme } from './react/config'
import ThemeManager from 'material-ui/lib/styles/theme-manager'
import { createContainer } from 'meteor/react-meteor-data'
import Loader from './react/components/Loader'
import FloatingNewRideButton from './react/layout/NewRideButton'
import FloatingFeedbackButton from './react/layout/FloatingFeedbackButton.jsx'
import { Paper } from 'material-ui'
import GoogleMap from './react/components/GoogleMap.jsx'

export class MainLayout extends React.Component {
  constructor (props) {
    super(props)

    const resizeListener = () => {
      this.setState(this.calcAppSize())
    }

    window.addEventListener('resize', resizeListener)
    window.addEventListener('orientationchange', resizeListener)

    const ww = window.innerWidth
    const wh = window.innerHeight
    this.state = {
      ...this.calcAppSize(),
      resizeListener,
    }
  }

  calcAppSize () {
    const ww = window.innerWidth;
    const wh = window.innerHeight;

    return {
      ww,
      wh,
      appWidth: ww > 1024 ? Math.max(ww * 0.4, 550) : ww,
      appHeight: ww <= 1024 ? wh : wh - 150,
      isMobile: ww <= 1024,
    }
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.state.resizeListener)
    window.removeEventListener('orientationchange', this.state.resizeListener)
  }

  getChildContext () {
    return {
      muiTheme: ThemeManager.getMuiTheme(muiTheme),
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

  getTopMargin () {
    return this.state.isMobile ? 0 : (this.state.wh - this.state.appHeight) * 0.35
  }

  renderMobile () {
    const topMenuHeight = this.props.topMenu ? 50 : 0;
    const topSearchHeight = this.props.topSearch ? 115 : 0;
    const topFilterHeight = this.props.topFilter ? 48 : 0; // Looks bad if not 48 at the moment
    const bottomMenuHeight = this.props.bottomMenu ? 64 : 0;
    const contentHeight = this.state.appHeight - (topMenuHeight + topSearchHeight + topFilterHeight + bottomMenuHeight);

    const topMargin = this.getTopMargin();

    // const iconSideOffset = (this.state.ww - this.state.appWidth) / 2;
    const leftIconSideOffset = this.state.isMobile ? 0 : 50;
    const rightIconSideOffset = this.state.isMobile ? 0 : this.state.ww - this.state.appWidth - 50;
    const bottomOffset = (this.state.wh - this.state.appHeight) + 8 - topMargin;

    return (
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
        <main>
          {this.renderElement(this.props.content, { height: contentHeight })}
        </main>
        {this.props.bottomMenu ? (
          <bottom>
            {this.renderElement(this.props.bottomMenu, { height: bottomMenuHeight, bottomOffset: bottomOffset })}
          </bottom>
        ) : null}
        {this.props.renderNewTripButton ? <FloatingNewRideButton isMobile={this.state.isMobile}
          sideOffset={rightIconSideOffset} bottomOffset={bottomOffset} /> : null}
        {this.props.renderFeedbackButton ? <FloatingFeedbackButton isMobile={this.state.isMobile}
          sideOffset={leftIconSideOffset} bottomOffset={bottomOffset} /> : null}
      </div>
    )
  }

  render () {
    if (this.state.isMobile) {
      return this.renderMobile()
    }

    const topMargin = this.getTopMargin();

    return (
      <div>
        <Paper
          style={{
            position: 'fixed',
            width:this.state.appWidth,
            height: this.state.appHeight,
            top: topMargin,
            left: 50,
          }}
        >
          {this.renderMobile()}
        </Paper>
        {/*<GoogleMap width={this.state.ww} height={this.state.wh} />*/}
      </div>
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
}

export const SecureLayout = createContainer((props) => {
  isLoading = !userSubs.ready();
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
