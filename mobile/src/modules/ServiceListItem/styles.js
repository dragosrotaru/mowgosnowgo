// Imports
import { StyleSheet } from 'react-native';
import { grey2 } from '../../colors';

// Styles
export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
  },
  type: {
  },
  address: {
    color: grey2,
    fontWeight: 'bold',
  },
  date: {
    backgroundColor: '#ccdfff',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  month: {
    color: '#1f67e2',
    fontWeight: 'bold',
    fontSize: 20,
  },
  day: {
    color: '#1f67e2',
  },
  details: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flex: 1,
  },
});
