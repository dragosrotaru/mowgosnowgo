// Imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ApolloConsumer } from 'react-apollo';
import { AsyncStorage } from 'react-native';
import { withNavigation } from 'react-navigation';
import { isEmail, isMobilePhone, isLength } from 'validator';
import { Container, Text, Toast, Form, Item, Input, Label, Button } from 'native-base';
import styles from './styles';
import { USER_SIGN_UP } from '../../graphql';

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      name: '',
      email: '',
      phone: '',
      password: '',
    };
    this.tos = () => this.props.navigation.navigate('tos');
    this.onSubmit = async (client) => {
      // Validate
      let error = false;

      if (!isLength(this.state.name, { min: 3 })) {
        error = true;
        Toast.show({
          text: 'Name needs to be atleast 3 characters long. Please try again.',
          buttonText: 'Okay',
        });
      } else if (!isEmail(this.state.email)) {
        error = true;
        Toast.show({
          text: 'The email you provided is invalid. Please try again.',
          buttonText: 'Okay',
        });
      } else if (!isMobilePhone(this.state.phone.replace(/\D/g, ''), 'en-CA')) {
        error = true;
        Toast.show({
          text: 'The phone # you provided is invalid. Please try again.',
          buttonText: 'Okay',
        });
      } else if (!isLength(this.state.password, { min: 5 })) {
        error = true;
        Toast.show({
          text: 'Password needs to be atleast 3 characters long. Please try again.',
          buttonText: 'Okay',
        });
      }

      if (error) {
        return false;
      }

      this.setState({ loading: true });
      Toast.show({
        text: 'Signing you up, please wait...',
        buttonText: 'Okay',
      });

      try {
        const response = await client.mutate({
          mutation: USER_SIGN_UP,
          variables: {
            name: this.state.name,
            email: this.state.email,
            phone: this.state.phone.replace(/\D/g, ''),
            password: this.state.password,
          },
        });
        await AsyncStorage.setItem('token', response.data.userSignUp.token);
        Toast.show({
          text: 'Signed up successfully! Signing you in, please wait...',
          buttonText: 'Okay',
        });
        this.props.navigation.navigate('AuthLoad');
      } catch (err) {
        this.setState({ loading: false });
      }
    };
  }

  render() {
    const {
      loading, name, email, phone, password,
    } = this.state;

    return (
      <ApolloConsumer>
        {client => (
          <Container style={styles.container}>
            <Text style={styles.heading}>Sign Up</Text>
            <Form style={styles.form}>
              <Item floatingLabel style={styles.item}>
                <Label>Name</Label>
                <Input
                  style={styles.item}
                  returnKeyType="next"
                  value={name}
                  onChangeText={text => this.setState({ name: text })}
                  autoFocus
                  autoCapitalize="words"
                  onSubmitEditing={() => {
                    this.inputEmail._root.focus();
                  }}
                  blurOnSubmit={false}
                />
              </Item>
              <Item floatingLabel style={styles.item}>
                <Label>Email</Label>
                <Input
                  autoCapitalize="none"
                  returnKeyType="next"
                  value={email}
                  onChangeText={text => this.setState({ email: text })}
                  onSubmitEditing={() => {
                    this.inputPhone._root.focus();
                  }}
                  getRef={(ref) => {
                    this.inputEmail = ref;
                  }}
                  keyboardType="email-address"
                  blurOnSubmit={false}
                />
              </Item>
              <Item floatingLabel style={styles.item}>
                <Label>Phone</Label>
                <Input
                  autoCapitalize="none"
                  returnKeyType="next"
                  value={phone}
                  onChangeText={phone => this.setState({ phone })}
                  onSubmitEditing={() => {
                    this.inputPassword._root.focus();
                  }}
                  getRef={(ref) => {
                    this.inputPhone = ref;
                  }}
                  keyboardType="phone-pad"
                  blurOnSubmit={false}
                />
              </Item>
              <Item floatingLabel style={styles.item}>
                <Label>Password</Label>
                <Input
                  autoCapitalize="none"
                  returnKeyType="go"
                  value={password}
                  onChangeText={text => this.setState({ password: text })}
                  onSubmitEditing={() => this.onSubmit(client)}
                  getRef={(ref) => {
                    this.inputPassword = ref;
                  }}
                  secureTextEntry
                />
              </Item>
              <Text style={styles.text}>
                By signing up you agree to the
                <Text style={{ color: 'blue' }} onPress={this.tos}>
                  {' '}
                  Terms of Service
                </Text>
              </Text>
              <Button disabled={loading} onPress={() => this.onSubmit(client)} full>
                <Text>Sign Up</Text>
              </Button>
            </Form>
          </Container>
        )}
      </ApolloConsumer>
    );
  }
}
SignUp.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default withNavigation(SignUp);
