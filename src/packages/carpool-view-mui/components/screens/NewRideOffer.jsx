import React from 'react'
import wrapMobileLayout from './NewMobileWrap'
import TextField from 'material-ui/lib/text-field'
import TopBar from './components/TopBar'
import LocationIcon from 'material-ui/lib/svg-icons/action/room'
import TimeIcon from 'material-ui/lib/svg-icons/action/query-builder'
import RepeatIcon from 'material-ui/lib/svg-icons/av/loop'
import BackButton from './components/BackButton'

export default class NewRideOffer extends React.Component {
  render () {
    const leftColWidth = 80
    const rightColWidth = window.innerWidth - leftColWidth
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
      }}>
        <TopBar
          leftIcon={<BackButton />}
          middleContent={'New ride offer'}
        />
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          marginTop: 60,
        }}>
          <div style={{
            width: leftColWidth,
          }}>
            <LocationIcon style={{marginLeft: 12, marginTop: 5}} />
          </div>
          <div>
            <div style={{
              fontSize: 11,
            }}>
              From
            </div>
            <div>
              <TextField
                style={{width: rightColWidth - 20, fontSize: 14}}
                hintText="Address, neighbourhood, landmark etc."
              />
            </div>
          </div>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          marginTop: 15,
        }}>
          <div style={{
            width: leftColWidth,
          }}>

          </div>
          <div>
            <div style={{
              fontSize: 11,
            }}>
              To
            </div>
            <TextField
              style={{width: rightColWidth - 20, fontSize: 14}}
              hintText="Address, neighbourhood, landmark etc."
            />
          </div>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          marginTop: 20,
        }}>
          <div style={{
            width: leftColWidth,
          }}>
            <TimeIcon style={{marginLeft: 12, marginTop: 5}} />
          </div>
          <div>
            <div style={{
              fontSize: 11,
            }}>
              When
            </div>
            <TextField
              style={{width: rightColWidth - 20, fontSize: 14}}
              hintText="Choose date and time"
            />
          </div>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          marginTop: 20,
        }}>
          <div style={{
            width: leftColWidth,
          }}>
            <RepeatIcon style={{marginLeft: 12, marginTop: 5}} />
          </div>
          <div>
            <div style={{
              fontSize: 11,
            }}>
              Repeat on
            </div>
            <TextField
              style={{width: rightColWidth - 20, fontSize: 14}}
              hintText="Select days"
            />
          </div>
        </div>
      </div>
    )
  }
}

NewRideOfferScreen = NewRideOffer
