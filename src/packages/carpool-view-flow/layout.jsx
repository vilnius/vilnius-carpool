import React from 'react'
import { muiTheme } from './react/config'
import ThemeManager from 'material-ui/lib/styles/theme-manager'

const Wrapper = React.createClass({
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

  componentWillUnmount () {
    window.removeEventListener('resize', this.state.resizeListener)
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  getChildContext () {
    return {
      muiTheme: ThemeManager.getMuiTheme(muiTheme),
    }
  },


  render () {
    return this.props.children
  }
})

export const LandingLayout = ({topMenu, topFilter, topSearch, content, bottomMenu, extras}) => (
    <Wrapper>
      <div>
        <header>
          {topMenu}
        </header>
        <main>
          {topFilter}
          {topSearch}
          <div style={{marginTop: topFilter ? 100 : (topSearch ? 165 : 50), paddingBottom: bottomMenu ? 52 : 0}}>{content}</div>
        </main>
        <bottom>
          {bottomMenu}
        </bottom>
        {extras}
      </div>
    </Wrapper>
);

export const NotificationLayout = ({topMenu, content, bottomMenu, extras}) => (
    <Wrapper>
      <div>
        <header>
          {topMenu}
        </header>
        <main>
          <div style={{marginTop: 50, paddingBottom: bottomMenu ? 52 : 0}}>{content}</div>
        </main>
        <bottom>
          {bottomMenu}
        </bottom>
        {extras}
      </div>
    </Wrapper>
);


export const PlainLayout = ({topMenu, content}) => (
    <Wrapper>
      <div>
        <header>
          {topMenu}
        </header>
        <main>
          {content}
        </main>
      </div>
    </Wrapper>
);
