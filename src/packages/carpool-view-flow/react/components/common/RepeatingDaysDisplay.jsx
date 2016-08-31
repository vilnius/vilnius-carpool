import React from 'react'
import { config } from '../../config'

const circleStyle = {
  marginRight: 3,
  width: 13,
  height: 13,
  borderRadius: 999,
  textAlign: 'center',
  fontSize: 9,
  lineHeight: '15px',
}

const filledCircleStyle = {
  background: config.colors.main,
  color: 'white',
  border: '1px solid ' + config.colors.main,
}

const emptyCircleStyle = {
  background: 'white',
  color: config.colors.main,
  border: '1px solid ' + config.colors.main,
}

const getRepeatingDaysArray = (daysActive) => {
  const repeatingDaysArray = [false, false, false, false, false, false, false];
  daysActive.forEach((day) => {
    repeatingDaysArray[day] = true;
  })
  return repeatingDaysArray;
}

const RepeatingDays = (props) => {
  const repeatingDaysArray = getRepeatingDaysArray(props.daysActive);
  const dayLetters = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  return (
    <div className="flex-row" style={{display: 'flex', flexDirection: 'row', fontFamily: config.font, justifyContent: 'flex-start', height: 14}}>
      {dayLetters.map((day, i) => (
        <div key={i} style={Object.assign({}, circleStyle, repeatingDaysArray[i] ? filledCircleStyle : emptyCircleStyle)}>
          <div style={{marginTop: -1}}>{day}</div>
        </div>
      ))}
    </div>
  );
}

RepeatingDays.propTypes = {
  daysActive: React.PropTypes.array.isRequired,
};

export default RepeatingDays
