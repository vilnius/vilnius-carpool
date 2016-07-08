import React from 'react'
import CircularProgress from 'material-ui/lib/circular-progress';

const Loader = ({ size }) => {
  const loaderSize = loaderSize ? loaderSize * 2 : 2
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

export default Loader
