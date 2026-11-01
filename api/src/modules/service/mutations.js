// Imports
import {
  GraphQLID,
  GraphQLFloat,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql';

// App Imports
import ServiceType from './types';
import { create, cancelByID, cancelByToken, denyByToken, approveByToken, completeByToken } from './resolvers';

// Service Create
export const serviceCreate = {
  type: ServiceType,
  args: {
    address: { type: new GraphQLNonNull(GraphQLString) },
    mapsURL: { type: new GraphQLNonNull(GraphQLString) },
    lat: { type: new GraphQLNonNull(GraphQLFloat) },
    lng: { type: new GraphQLNonNull(GraphQLFloat) },
    date: { type: new GraphQLNonNull(GraphQLString) },
    type: { type: new GraphQLNonNull(GraphQLString) },
    size: { type: GraphQLString },
    extras: { type: new GraphQLList(GraphQLString) },
    comments: { type: GraphQLString },
    price: { type: new GraphQLNonNull(GraphQLFloat) },
    paymentToken: { type: GraphQLString },
  },
  resolve: create,
};

// Service Cancel By ID
export const serviceCancelByID = {
  type: ServiceType,
  args: {
    id: { type: GraphQLID },
  },
  resolve: cancelByID,
};

// Service Cancel By Token
export const serviceCancelByToken = {
  type: ServiceType,
  args: {
    token: { type: GraphQLString },
  },
  resolve: cancelByToken,
};

// Service Deny By Token
export const serviceDenyByToken = {
  type: ServiceType,
  args: {
    token: { type: GraphQLString },
  },
  resolve: denyByToken,
};

// Service Approve By Token
export const serviceApproveByToken = {
  type: ServiceType,
  args: {
    token: { type: GraphQLString },
  },
  resolve: approveByToken,
};

// Service Complete By Token
export const serviceCompleteByToken = {
  type: ServiceType,
  args: {
    token: { type: GraphQLString },
  },
  resolve: completeByToken,
};
