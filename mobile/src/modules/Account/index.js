import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { Query } from 'react-apollo';
import { Container, Text } from 'native-base';
import styles from './styles';
import Loading from '../Loading';
import Menu from '../Menu';
import { USER_GET_BY_TOKEN } from '../../graphql';

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
    this.getToken = async () => {
      const token = await AsyncStorage.getItem('token');
      this.setState({ token, loaded: true });
    };
    this.getToken();
  }
  render() {
    if (this.state.loaded) {
      return (
        <Query query={USER_GET_BY_TOKEN} variables={{ token: this.state.token }}>
          {({ loading, error, data }) => {
            if (loading) return <Loading />;
            if (error) return <Text>An Error Occured</Text>;
            return (
              <Menu title="  My Account">
                <Container style={styles.container}>
                  <Text style={styles.text}>Name: { data.userGetByToken.name }</Text>
                  <Text style={styles.text}>Email: { data.userGetByToken.email }</Text>
                  <Text style={styles.text}>Phone: { data.userGetByToken.phone }</Text>
                </Container>
              </Menu>
            );
          }}
        </Query>
      );
    }
    return (<Loading />);
  }
}

export default Account;
