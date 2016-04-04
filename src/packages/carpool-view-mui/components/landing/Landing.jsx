import React from 'react'
import PageRoot from '../layout/PageRoot'
import FloatingActionButton from 'material-ui/lib/floating-action-button'
import ContentAdd from 'material-ui/lib/svg-icons/content/add'


class LandingBase extends React.Component {
  render () {
    return (
      <div>
        <FloatingActionButton primary={true} onClick={() => {console.log('Should route to trip form')}} style={{
          position: 'absolute',
          bottom: 12,
          right: 12,
        }}>
          <ContentAdd />
        </FloatingActionButton>
        Something something landing page
      </div>
    )
  }
}

Landing = PageRoot(LandingBase)
