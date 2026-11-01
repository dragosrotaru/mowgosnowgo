// Imports
import { AsyncStorage } from 'react-native';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { Toast } from 'native-base';

// App Imports
import config from './config';

const cache = new InMemoryCache();

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message }) => {
      Toast.show({
        text: message,
        buttonText: 'Okay',
      });
    });
  }
  if (networkError) {
    Toast.show({
      text: `Network error: ${networkError}`,
      buttonText: 'Okay',
    });
  }
});

const httpLink = new HttpLink({
  uri: config.api,
  credentials: 'same-origin',
});

const client = new ApolloClient({
  cache,
  link: ApolloLink.from([authLink, errorLink, httpLink]),
});

export default client;
