import React from 'react'
import { muiTheme } from './react/config'
import ThemeManager from 'material-ui/lib/styles/theme-manager'

const Wrapper = React.createClass({

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

export const LandingLayout = ({topMenu, topFilter, content, bottomMenu, extras}) => (
    <Wrapper>
      <div>
        <header>
          {topMenu}
        </header>
        <main>
          {topFilter}
          <div style={{marginTop: topFilter ? 100 : 50, paddingBottom: bottomMenu ? 52 : 0}}>{content}</div>
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
