// Imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, AsyncStorage } from 'react-native';
import { withNavigation } from 'react-navigation';
import { ApolloConsumer } from 'react-apollo';
import Expo from 'expo';
import {
  Container,
  Button,
  Text,
  Icon,
  Tab,
  Tabs,
  TabHeading,
  Header,
  Toast,
} from 'native-base';
import logo from '../../../assets/images/logo.png';
import styles from './styles';
import { USER_LOGIN_FACEBOOK } from '../../graphql';
import config from '../../config';

class Splash extends Component {
  constructor(props) {
    super(props);
    this.loginEmail = () => {
      this.props.navigation.navigate('login');
    };
    this.loginFacebook = async (client) => {
      const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(config.facebookAppID, { permissions: ['public_profile', 'email'] });
      if (type === 'success') {
        try {
          const response = await client.query({
            query: USER_LOGIN_FACEBOOK,
            variables: {
              facebookToken: token,
            },
          });
          if (response.data.userLoginFacebook.token) {
            await AsyncStorage.setItem('token', response.data.userLoginFacebook.token);
            Toast.show({
              text: 'Signed in successfully, Welcome back!',
              buttonText: 'Okay',
            });
            this.props.navigation.navigate('AuthLoad');
          } else {
            this.props.navigation.navigate('signUpWithFacebook', { token });
          }
        } catch (err) {
          Toast.show({
            text: 'There Was an Error with Facebook. Please try again later',
            buttonText: 'Okay',
          });
        }
      }
    };
    this.signup = () => {
      this.props.navigation.navigate('signup');
    };
  }
  render() {
    return (
      <ApolloConsumer>
        { client => (
          <Container style={styles.container}>
            <Header style={styles.header} />
            <Tabs style={styles.tab}>
              <Tab style={styles.tabs} heading={<TabHeading><Text>Login</Text></TabHeading>}>
                <Container style={styles.container}>
                  <Image
                    source={logo}
                    resizeMode="cover"
                    style={styles.logo}
                  />
                  <Container>
                    <Text style={styles.tagline}>Lawn Care and Snow Removal Made Easy</Text>
                  </Container>
                  <Container>
                    <Button
                      primary
                      iconLeft
                      style={styles.buttons}
                      onPress={() => this.loginFacebook(client)}
                    >
                      <Icon name="logo-facebook" />
                      <Text>Sign In With Facebook</Text>
                    </Button>
                    <Button primary iconLeft style={styles.buttons} onPress={this.loginEmail}>
                      <Icon name="mail" />
                      <Text>Sign In With Email</Text>
                    </Button>
                  </Container>
                  <Text>Dont Have Facebook?
                    <Text style={{ color: 'blue' }} onPress={this.signup}> Sign Up With Email</Text>
                  </Text>
                </Container>
              </Tab>
              <Tab style={styles.tabs} heading={<TabHeading><Text>How It Works</Text></TabHeading>}>
                <Container style={styles.stepContainerParent}>
                  <Container><Text style={styles.tagline}>How It Works</Text></Container>
                  <Container style={styles.stepContainer}>
                    <Icon name="md-phone-portrait" style={styles.icon} />
                    <Text style={styles.step}>Make a service request.</Text>
                  </Container>
                  <Container style={styles.stepContainer}>
                    <Icon name="ios-checkmark-circle-outline" style={styles.icon} />
                    <Text style={styles.step}>Our pros complete the job.</Text>
                  </Container>
                  <Container style={styles.stepContainer}>
                    <Icon name="ios-card" style={styles.icon} />
                    <Text style={styles.step}>Pay when the job is done</Text>
                  </Container>
                  <Container><Text style={styles.tagline}>Its that easy!</Text></Container>
                </Container>
              </Tab>
            </Tabs>
          </Container>
        )}
      </ApolloConsumer>
    );
  }
}
Splash.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default withNavigation(Splash);
