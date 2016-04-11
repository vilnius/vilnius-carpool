import React from 'react'
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import FlatButton from 'material-ui/lib/flat-button';
import CardText from 'material-ui/lib/card/card-text';

export default class TripCard extends React.Component {
  render () {
    return (
      <div style={{
        margin: 15,
        cursor: 'pointer',
      }}>
        <Card onClick={() => {muiControllerHelper.goToView(this.props.trip.linkTo)}}>
          <CardHeader
            title={this.props.trip.title}
          />
          <CardText>
            {`Trip from ${this.props.trip.from} to ${this.props.trip.to}`}
          </CardText>
        </Card>
      </div>
    )
  }
}
