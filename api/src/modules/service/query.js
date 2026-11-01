// Imports
import { GraphQLID, GraphQLList } from 'graphql';

// App Imports
import ServiceType from './types';
import { getAll, getAllByUserToken, getByID } from './resolvers';

// Service Get All
export const serviceGetAll = {
  type: new GraphQLList(ServiceType),
  resolve: getAll,
};

// Service Get All By User Token
export const serviceGetAllByUserToken = {
  type: new GraphQLList(ServiceType),
  resolve: getAllByUserToken,
};

// Service Get By ID
export const serviceGetByID = {
  type: ServiceType,
  args: {
    id: { type: GraphQLID },
  },
  resolve: getByID,
};
