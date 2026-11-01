// Imports
import React, { Component } from 'react';
import { ApolloProvider } from 'react-apollo';
import { Root } from 'native-base';
import Expo from 'expo';

// App Imports
import Loading from './src/modules/Loading';
import Routes from './src/routes';
import client from './src/apollo';

const Roboto = require('native-base/Fonts/Roboto.ttf');
const RobotoMedium = require('native-base/Fonts/Roboto_medium.ttf');

// App
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  async componentDidMount() {
    await Expo.Font.loadAsync({
      Roboto,
      Roboto_medium: RobotoMedium,
    });
    this.setState({ loaded: true });
  }
  render() {
    if (this.state.loaded) {
      return (
        <Root>
          <ApolloProvider client={ client }>
            <Routes />
          </ApolloProvider>
        </Root>
      );
    }
    return (<Loading />);
  }
}
