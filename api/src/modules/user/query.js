// Imports
import { GraphQLInt, GraphQLString, GraphQLList } from 'graphql';

// App Imports
import { UserType, UserLoginType } from './types';
import {
  getAll,
  getById,
  getByToken,
  login,
  loginFacebook,
} from './resolvers';

// All
export const userGetAll = {
  type: new GraphQLList(UserType),
  resolve: getAll,
};

// By ID
export const userGetByID = {
  type: UserType,
  args: {
    id: { type: GraphQLInt },
  },
  resolve: getById,
};

// By Token
export const userGetByToken = {
  type: UserType,
  args: {
    token: { type: GraphQLString },
  },
  resolve: getByToken,
};

// Auth
export const userLogin = {
  type: UserLoginType,
  args: {
    email: {
      name: 'email',
      type: GraphQLString,
    },
    password: {
      name: 'password',
      type: GraphQLString,
    },
  },
  resolve: login,
};

// Auth
export const userLoginFacebook = {
  type: UserLoginType,
  args: {
    facebookToken: {
      name: 'facebookToken',
      type: GraphQLString,
    },
  },
  resolve: loginFacebook,
};
