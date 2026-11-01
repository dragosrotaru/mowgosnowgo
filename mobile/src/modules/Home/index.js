// Imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';
import { AsyncStorage } from 'react-native';
import { Container, Content, Icon, Fab } from 'native-base';
import ServiceList from '../ServiceList';
import Menu from '../Menu';

class Home extends Component {
  constructor() {
    super();
    this.newService = () => this.props.navigation.navigate('createServiceRequest');
    this.firstTime = async () => {
      const firstTime = await AsyncStorage.getItem('firstTime');
      if (firstTime !== 'false') {
        AsyncStorage.setItem('firstTime', 'false');
        this.props.navigation.navigate('createServiceRequest');
      }
    };
    this.firstTime();
  }
  render() {
    return (
      <Menu title="  My Services">
        <Container>
          <Content>
            <ServiceList />
          </Content>
          <Fab
            position="bottomRight"
            style={{ backgroundColor: '#5cb85c' }}
            onPress={this.newService}
          >
            <Icon name="add" />
          </Fab>
        </Container>
      </Menu>
    );
  }
}
Home.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default withNavigation(Home);
