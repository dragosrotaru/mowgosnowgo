// Imports
import { StyleSheet } from 'react-native';

// UI Imports
import { deviceWidth, deviceHeight } from '../../responsive';

// Styles
export default StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 300,
    maxWidth: deviceWidth,
    height: deviceHeight / 3,
  },
  tagline: {
    paddingTop: 40,
    fontSize: 25,
    textAlign: 'center',
  },
  step: {
    fontSize: 20,
  },
  icon: {
    fontSize: 50,
    paddingRight: 20,
  },
  stepContainerParent: {
    alignItems: 'center',
  },
  stepContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: deviceWidth * 0.8,
  },
  affiliates: {
    width: deviceWidth,
    height: deviceHeight / 3,
  },
  tab: {
    marginTop: -60,
  },
  header: {
    marginTop: -60,
  },
  tabs: {
    padding: 20,
  },
  bold: {
    fontSize: 27,
    fontWeight: 'bold',
  },
  buttons: {
    width: deviceWidth * 0.7,
    minWidth: 300,
    margin: 20,
  },
  tempButtons: {
    width: deviceWidth * 0.7,
    minWidth: 300,
    margin: 20,
    justifyContent: 'center',
  },
});
