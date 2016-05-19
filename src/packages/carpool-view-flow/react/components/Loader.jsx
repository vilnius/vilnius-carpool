import React from 'react'
import CircularProgress from 'material-ui/lib/circular-progress';

export default class Loader extends React.Component {
  render () {
    const size = this.props.size ? this.props.size * 2 : 2
    return (
      <div style={{
        paddingTop: 45 * (size - 1),
        paddingBottom: 45 * (size - 1),
        width: '100%',
        textAlign: 'center',
      }}>
        <CircularProgress style={{margin: '0px auto'}} size={size} />
      </div>
    )
  }
}
