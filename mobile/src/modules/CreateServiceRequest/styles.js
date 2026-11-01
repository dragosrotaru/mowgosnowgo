import { StyleSheet } from 'react-native';
// Imports
import { deviceHeight } from '../../responsive';
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
  placeholder: {
    color: grey2,
  },
  icon: {
    color: grey2,
  },
  location: {
    maxWidth: '80%',
  },
  spacer: {
    height: 40,
  },
  footer: {
    padding: 20,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    maxHeight: 80,
  },
  price: {
    color: 'black',
    fontSize: 16,
  },
  payForm: {
    height: deviceHeight * 0.5,
  },
  priceMessage: {
    fontSize: 22,
    margin: 20,
    textAlign: 'center',
  },
  finalPrice: {
    fontSize: 25,
    textAlign: 'center',
    padding: 20,
  },
});
