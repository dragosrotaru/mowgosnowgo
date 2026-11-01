import { StyleSheet } from 'react-native';
// Imports
import { deviceHeight, deviceWidth } from '../../responsive';
import { grey2 } from '../../colors';

// Styles
export default StyleSheet.create({
  content: {
    minHeight: deviceHeight * 0.7,
  },
  form: {
    padding: 20,
  },
  card: {
    width: '99%',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  cardItem: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    margin: 20,
    marginLeft: 0,
    width: '100%',
  },
  icon: {
    color: grey2,
  },
  location: {
    maxWidth: '80%',
  },
  footer: {
    padding: 20,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  modalContainer: {
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: deviceWidth * 0.8,
  },
});
