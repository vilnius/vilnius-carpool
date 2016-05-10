import React from 'react'
import DesktopLayout from './DesktopLayout'
import MobileLayout from './MobileLayout'
import ThemeManager from 'material-ui/lib/styles/theme-manager'
import { muiTheme } from '../config'

const wrapScreen = (Component, config = {}) => React.createClass({

  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  getInitialState () {
    const resizeListener = () => {
      this.setState({
        ww: window.innerWidth,
        wh: window.innerHeight
      })
    }

    window.addEventListener('resize', resizeListener)

    return {
      ww: window.innerWidth,
      wh: window.innerHeight,
      resizeListener,
    }
  },

  getChildContext () {
    return {
      muiTheme: ThemeManager.getMuiTheme(muiTheme),
    }
  },

  componentWillUnmount () {
    window.removeEventListener('resize', this.state.resizeListener)
  },

  render () {
    const Layout = this.state.ww > 900 ? DesktopLayout : MobileLayout
    const width = Math.min(1320, this.state.ww)
    return (
      <Layout width={width} height={this.state.wh} config={config} >
        <Component width={width} height={this.state.wh} />
      </Layout>
    )
  },
})

export default wrapScreen
