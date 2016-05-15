import React from 'react'
import TextField from 'material-ui/lib/text-field'
import ExpandMoreIcon from 'material-ui/lib/svg-icons/navigation/expand-more'
import ExpandLessIcon from 'material-ui/lib/svg-icons/navigation/expand-less'
import Divider from 'material-ui/lib/divider'
import FlatButton from 'material-ui/lib/flat-button'

const hintStyle = {
  color: '#eee'
}

const inputStyle = {
  marginLeft: 12,
}

export default class TripSearch extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      expanded: false,
    }
  }

  renderExpandedView (width) {
    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', width: width}}>
          <div style={{width: width - 50}}>
            <div>
              <div style={{fontWeight: 'bold', width: 45, display: 'inline-block'}}>From</div>
              <TextField
                hintText="Current location"
                hintStyle={hintStyle}
                style={inputStyle}
                underlineShow={false}
                style={{
                  width: width - 105,
                  marginLeft: 'auto',
                }}
              />
            </div>
            <Divider />
            <div>
              <div style={{fontWeight: 'bold', width: 45, display: 'inline-block'}}>To</div>
              <TextField
                hintText="Where do you want to go?"
                hintStyle={hintStyle}
                style={inputStyle}
                underlineShow={false}
                style={{
                  width: width - 105,
                  marginLeft: 'auto',
                }}
              />
            </div>
            <Divider />
            <div>
              <div style={{fontWeight: 'bold', width: 45, display: 'inline-block'}}>Date</div>
              <TextField
                hintText="Current date"
                hintStyle={hintStyle}
                style={inputStyle}
                underlineShow={false}
                style={{
                  width: width - 105,
                  marginLeft: 'auto',
                }}
              />
            </div>
            <Divider />
            <div>
              <div style={{fontWeight: 'bold', width: 45, display: 'inline-block'}}>Time</div>
              <TextField
                hintText="Current time"
                hintStyle={hintStyle}
                style={inputStyle}
                underlineShow={false}
                style={{
                  width: width - 105,
                  marginLeft: 'auto',
                }}
              />
            </div>
            <Divider />
          </div>
          <div style={{width: 40, marginLeft: 10}} onClick={() => this.setState({expanded: false})}><ExpandLessIcon color="white" /></div>
        </div>
        <div style={{
          alignSelf: 'flex-end',
          margin: 10
        }}>
          {/* <FlatButton label="Search" primary /> */}
        </div>
      </div>
    )
  }

  renderCompressedView (width) {
    return (
      <div style={{display: 'flex', flexDirection: 'row', width, alignItems: 'center'}}>
        <div style={{width: width - 50}}>
          <b>To</b>
          <TextField
            hintText="Where do you want to go?"
            hintStyle={hintStyle}
            style={inputStyle}
          />
        </div>
        <div style={{width: 40, marginLeft: 10}} onClick={() => this.setState({expanded: true})}><ExpandMoreIcon color="white" /></div>
      </div>
    )
  }

  render () {
    const width = this.props.width
    return (
      <div>
        {this.state.expanded ? this.renderExpandedView(width) : this.renderCompressedView(width)}
      </div>
    )
  }
}
