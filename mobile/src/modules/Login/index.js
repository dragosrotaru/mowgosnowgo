// Imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';
import { isEmail, isLength } from 'validator';
import { ApolloConsumer } from 'react-apollo';
import { AsyncStorage } from 'react-native';
import { Container, Text, Button, Form, Item, Input, Label, Toast } from 'native-base';
import styles from './styles';
import { USER_LOGIN } from '../../graphql';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      email: '',
      password: '',
    };
    this.forgotPassword = () => this.props.navigation.navigate('forgotPassword');
    this.onSubmit = async (client) => {
      const user = {
        email: this.state.email,
        password: this.state.password,
      };

      // Validate
      let error = false;

      if (!isEmail(user.email)) {
        Toast.show({
          text: 'The email you provided is invalid. Please try again.',
          buttonText: 'Okay',
        });
        error = true;
      } else if (!isLength(user.password, { min: 3 })) {
        Toast.show({
          text: 'Password needs to be atleast 3 characters long. Please try again.',
          buttonText: 'Okay',
        });
        error = true;
      }

      if (error) {
        return false;
      }
      this.setState({ loading: true });
      Toast.show({
        text: 'Signing you in, please wait...',
        buttonText: 'Okay',
      });

      // API Call
      try {
        const response = await client.query({
          query: USER_LOGIN,
          variables: user,
        });
        await AsyncStorage.setItem('token', response.data.userLogin.token);
        Toast.show({
          text: 'Signed in successfully, Welcome back!',
          buttonText: 'Okay',
        });
        this.props.navigation.navigate('AuthLoad');
      } catch (err) {
        this.setState({ loading: false });
      }
    };
  }

  render() {
    return (
      <ApolloConsumer>
        {client => (
          <Container style={styles.container}>
            <Text style={styles.heading}>Sign In</Text>
            <Form style={styles.form}>
              <Item floatingLabel style={styles.item}>
                <Label>Email</Label>
                <Input
                  autoCapitalize="none"
                  returnKeyType="next"
                  value={this.state.email}
                  onChangeText={email => this.setState({ email })}
                  onSubmitEditing={() => {
                    this.inputPassword._root.focus();
                  }}
                  autoFocus
                  keyboardType="email-address"
                  blurOnSubmit={false}
                />
              </Item>
              <Item floatingLabel style={styles.item}>
                <Label>Password</Label>
                <Input
                  autoCapitalize="none"
                  returnKeyType="go"
                  value={this.state.password}
                  onChangeText={password => this.setState({ password })}
                  onSubmitEditing={() => this.onSubmit(client)}
                  getRef={ref => (this.inputPassword = ref)}
                  secureTextEntry
                />
              </Item>
              <Text style={styles.text}>
                Forgot Your Password?
                <Text style={{ color: 'blue' }} onPress={this.forgotPassword}>
                  {' '}
                  Click Here
                </Text>
              </Text>
              <Button full disabled={this.state.loading} onPress={() => this.onSubmit(client)}>
                <Text>Sign In</Text>
              </Button>
            </Form>
          </Container>
        )}
      </ApolloConsumer>
    );
  }
}
Login.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default withNavigation(Login);
