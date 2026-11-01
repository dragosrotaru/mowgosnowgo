// Imports
import { GraphQLString, GraphQLID } from 'graphql';

// App Imports
import { UserType, UserLoginType } from './types';
import { create, createFacebook, remove, forgotPassword } from './resolvers';

// User Create
export const userSignUp = {
  type: UserLoginType,
  args: {
    name: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    phone: {
      type: GraphQLString,
    },
    password: {
      type: GraphQLString,
    },
  },
  resolve: create,
};

// User Create
export const userSignUpFacebook = {
  type: UserLoginType,
  args: {
    name: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    phone: {
      type: GraphQLString,
    },
    facebookToken: {
      type: GraphQLString,
    },
  },
  resolve: createFacebook,
};

// User Remove
export const userRemove = {
  type: UserType,
  args: {
    id: {
      type: GraphQLID,
    },
  },
  resolve: remove,
};

// User Remove
export const userForgotPassword = {
  type: UserType,
  args: {
    email: {
      type: GraphQLString,
    },
  },
  resolve: forgotPassword,
};

// User Update
/* export const userUpdate = {
  type: UserType,
  args: {
    id: {
      type: GraphQLID,
    },
    name: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    phone: {
      type: GraphQLString,
    },
  },
  resolve: update,
}; */
