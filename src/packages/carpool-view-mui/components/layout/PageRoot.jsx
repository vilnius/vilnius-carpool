import React from 'react'
import DesktopLayout from './DesktopLayout'
import MobileLayout from './MobileLayout'

// For material ui, shoule be moved somewhere to app initialization
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const PageRoot = (Component) => class extends React.Component {
  constructor (props) {
    super(props)

    const resizeListener = () => {
      this.setState({
        ww: window.innerWidth,
        wh: window.innerHeight
      })
    }

    window.addEventListener('resize', resizeListener)

    this.state = {
      ww: window.innerWidth,
      wh: window.innerHeight,
      resizeListener,
    }
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.state.resizeListener)
  }

  render () {
    const Layout = this.state.ww > 900 ? DesktopLayout : MobileLayout
    const width = Math.min(1320, this.state.ww)
    return (
      <Layout width={width} height={this.state.wh} >
        <Component width={width} height={this.state.wh} />
      </Layout>
    )
  }
}

export default PageRoot
