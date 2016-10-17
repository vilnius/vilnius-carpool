import Colors from 'material-ui/lib/styles/colors';
import ColorManipulator from 'material-ui/lib/utils/color-manipulator';
import Spacing from 'material-ui/lib/styles/spacing';
import zIndex from 'material-ui/lib/styles/zIndex';

export const config = {
  colors: {
    main: '#008DD0',
    highlight: '#F15A29',
    mainGreen: '#40AC31',
    lightBlue: '#33A4D9',
    success: '#40AC31',
    textColor: '#666',
    yellow: "#FDD835",
    red: "red",
    green: "green",
  },
  font: 'Roboto, sans-serif',
}


export const muiTheme = {
  spacing: Spacing,
  zIndex: zIndex,
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: config.colors.main,
    primary2Color: Colors.cyan700,
    primary3Color: Colors.lightBlack,
    accent1Color: config.colors.highlight,
    accent2Color: Colors.grey100,
    accent3Color: Colors.grey500,
    textColor: Colors.darkBlack,
    alternateTextColor: Colors.white,
    canvasColor: Colors.white,
    borderColor: Colors.grey300,
    disabledColor: ColorManipulator.fade(Colors.darkBlack, 0.3),
    pickerHeaderColor: Colors.cyan500,
  }
};
//
// export default {
//   config,
//   muiTheme,
// }
