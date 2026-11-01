// Imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AsyncStorage } from 'react-native';
import { withNavigation } from 'react-navigation';
import {
  Container,
  Drawer,
  Header,
  Body,
  Right,
  Title,
  Button,
  Icon,
  List,
  ListItem,
  Text,
  Toast,
} from 'native-base';

class Menu extends Component {
  constructor() {
    super();
    this.closeDrawer = () => {
      this.drawer._root.close();
    };
    this.openDrawer = () => {
      this.drawer._root.open();
    };
    this.home = () => this.props.navigation.navigate('home');
    this.add = () => this.props.navigation.navigate('createServiceRequest');
    this.account = () => this.props.navigation.navigate('account');
    this.about = () => this.props.navigation.navigate('about');
    this.logout = async () => {
      await AsyncStorage.removeItem('token');
      Toast.show({
        text: 'Signed out successfully.',
        buttonText: 'Okay',
      });
      this.props.navigation.navigate('AuthLoad');
    };
  }
  render() {
    return (
      <Drawer
        ref={(ref) => { this.drawer = ref; }}
        content={
          (
            <Container style={{ backgroundColor: '#FFFFFF' }}>
              <Header>
                <Body>
                  <Title>  Menu</Title>
                </Body>
              </Header>
              <List>
                <ListItem onPress={this.home} >
                  <Icon name="home" />
                  <Text>  My Services</Text>
                </ListItem>
                <ListItem onPress={this.add} >
                  <Icon name="ios-add" />
                  <Text>  Add New Service</Text>
                </ListItem>
                <ListItem onPress={this.account} >
                  <Icon name="settings" />
                  <Text>  My Account</Text>
                </ListItem>
                <ListItem onPress={this.about} >
                  <Icon name="ios-information-circle" />
                  <Text>  About</Text>
                </ListItem>
                <ListItem onPress={this.logout} >
                  <Icon name="log-out" />
                  <Text>  Log Out</Text>
                </ListItem>
              </List>
            </Container>
          )
        }
        onClose={this.closeDrawer}
      >
        <Container>
          <Header>
            <Body>
              <Title>{ this.props.title }</Title>
            </Body>
            <Right>
              <Button transparent onPress={this.openDrawer}>
                <Icon name="menu" />
              </Button>
            </Right>
          </Header>
          { this.props.children }
        </Container>
      </Drawer>
    );
  }
}
Menu.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
Menu.defaultProps = {
  title: '',
};

export default withNavigation(Menu);
