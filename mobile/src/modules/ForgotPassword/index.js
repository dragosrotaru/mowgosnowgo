// Imports
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ApolloConsumer } from 'react-apollo';
import { withNavigation } from 'react-navigation';
import { isEmail } from 'validator';
import { Container, Form, Item, Label, Input, Toast, Text, Button } from 'native-base';
import styles from './styles';
import { USER_FORGOT_PASSWORD } from '../../graphql';

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      email: '',
    };

    this.onSubmit = async (client) => {
      // Validate
      let error = false;
      if (!isEmail(this.state.email)) {
        Toast.show({
          text: 'The email you provided is invalid. Please try again.',
          buttonText: 'Okay',
        });
        error = true;
      }

      if (error) {
        return false;
      }

      this.setState({ loading: true });
      try {
        await client.mutate({
          mutation: USER_FORGOT_PASSWORD,
          variables: {
            email: this.state.email,
          },
        });
        Toast.show({
          text: 'Email sent! You will receive a password reset link shortly',
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
            <Text style={styles.heading}>Forgot Your Password?</Text>
            <Form style={styles.form}>
              <Item floatingLabel style={styles.item}>
                <Label>Email</Label>
                <Input
                  autoCapitalize="none"
                  returnKeyType="go"
                  value={this.state.email}
                  onChangeText={email => this.setState({ email })}
                  onSubmitEditing={event => this.onSubmit(event)}
                  autoFocus
                  keyboardType="email-address"
                  blurOnSubmit={false}
                />
              </Item>
              <Text style={styles.text}>
                Submit your email address and we’ll send you a link to reset your password.
              </Text>
              <Button full disabled={this.state.loading} onPress={() => this.onSubmit(client)}>
                <Text>Send Email</Text>
              </Button>
            </Form>
          </Container>
        )}
      </ApolloConsumer>
    );
  }
}
ForgotPassword.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default withNavigation(ForgotPassword);
