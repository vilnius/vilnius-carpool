import React from 'react'
import { muiTheme } from './react/config'
import ThemeManager from 'material-ui/lib/styles/theme-manager'
import { createContainer } from 'meteor/react-meteor-data'
import Loader from './react/components/Loader'
import FloatingFeedbackButton from './react/layout/FloatingFeedbackButton.jsx'

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
        <FloatingFeedbackButton />
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
        <FloatingFeedbackButton />
      </div>
    </Wrapper>
);


// This layout makes sure that at least users subscribtion is loadded
// TODO apply this only for login
export const PlainLayout = createContainer(({topMenu, content}) => {
  isLoading = !userSubs.ready();
  return {isLoading, topMenu, content};
}, ({isLoading, topMenu, content}) => {
  const topBarHeight = 45

  if(isLoading) {
    return (
      <section style={{height: "100%", marginTop: 25}}>
        <Loader />
      </section>
    )
  } else {
    return (
      <Wrapper>
        <div>
          <header>
            {topMenu}
          </header>
          <main style={{marginTop: topBarHeight }}>
            {content}
          </main>
        </div>
      </Wrapper>
    )
  }
});
