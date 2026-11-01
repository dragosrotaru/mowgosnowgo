import { StackNavigator, SwitchNavigator } from 'react-navigation';
import config from './config';
import Authentication from './modules/Authentication';
import Splash from './modules/Splash';
import Login from './modules/Login';
import SignUp from './modules/SignUp';
import ForgotPassword from './modules/ForgotPassword';
import ToS from './modules/ToS';
import Home from './modules/Home';
import Account from './modules/Account';
import About from './modules/About';
import CreateServiceRequest from './modules/CreateServiceRequest';
import ServiceDetails from './modules/ServiceDetails';
import SignUpWithFacebook from './modules/SignUpWithFacebook';

// API
export const routeApi = config.api;
export const routeImage = routeApi;

// Routes
export const appRoutes = {
  about: {
    name: 'about',
    path: 'about',
    screen: About,
  },
  home: {
    name: 'home',
    path: 'home',
    screen: Home,
  },
  account: {
    name: 'account',
    path: 'account',
    screen: Account,
  },
  createServiceRequest: {
    name: 'createServiceRequest',
    path: 'create-service-request',
    screen: CreateServiceRequest,
  },
  serviceDetails: {
    name: 'serviceDetails',
    path: 'service-details',
    screen: ServiceDetails,
  },
};

export const authRoutes = {
  splash: {
    name: 'splash',
    path: 'splash',
    screen: Splash,
  },
  login: {
    name: 'login',
    path: 'login',
    screen: Login,
  },
  signup: {
    name: 'signup',
    path: 'signup',
    screen: SignUp,
  },
  signUpWithFacebook: {
    name: 'signup',
    path: 'signup',
    screen: SignUpWithFacebook,
  },
  forgotPassword: {
    name: 'forgotPassword',
    path: 'forgotPassword',
    screen: ForgotPassword,
  },
  tos: {
    name: 'tos',
    path: 'tos',
    screen: ToS,
  },
};

const appRoutesStack = Object.keys(appRoutes).reduce((result, key) => {
  result[key] = appRoutes[key];
  return result;
}, {});

const authRoutesStack = Object.keys(authRoutes).reduce((result, key) => {
  result[key] = authRoutes[key];
  return result;
}, {});

const AppStack = StackNavigator(
  appRoutesStack,
  {
    initialRouteName: 'home',
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  },
);

const AuthStack = StackNavigator(
  authRoutesStack,
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  },
);

export default SwitchNavigator(
  {
    App: AppStack,
    Auth: AuthStack,
    AuthLoad: Authentication,
  },
  {
    initialRouteName: 'AuthLoad',
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  },
);
