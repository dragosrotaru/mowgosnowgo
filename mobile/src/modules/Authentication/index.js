// Imports
import React from 'react';
import PropTypes from 'prop-types';
import { AsyncStorage } from 'react-native';
import { withNavigation } from 'react-navigation';
import Loading from '../Loading';

const Authentication = (props) => {
  async function checkAuth() {
    const token = await AsyncStorage.getItem('token');
    props.navigation.navigate(token ? 'App' : 'Auth');
  }
  checkAuth();
  return <Loading />;
};
Authentication.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default withNavigation(Authentication);
