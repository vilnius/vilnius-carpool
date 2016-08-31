import React from 'react'
import CircularProgress from 'material-ui/lib/circular-progress';

const Loader = (props) => {
  const loaderSize = props.size ? props.size * 2 : 2
  return (
    <div style={{
      paddingTop: 45 * (loaderSize - 1),
      paddingBottom: 45 * (loaderSize - 1),
      width: '100%',
      textAlign: 'center',
    }}>
      <CircularProgress style={{margin: '0px auto'}} size={loaderSize} />
    </div>
  )
}

Loader.propTypes = {
  size: React.PropTypes.number,
}

export default Loader
