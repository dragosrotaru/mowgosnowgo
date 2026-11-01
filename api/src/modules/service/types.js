// Imports
import {
  GraphQLID,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
} from 'graphql';

// App Imports
import { UserType } from '../user/types';

// Service type
const ServiceType = new GraphQLObjectType({
  name: 'Service',
  description: 'Service Type',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    user: { type: new GraphQLNonNull(UserType) },
    address: { type: new GraphQLNonNull(GraphQLString) },
    mapsURL: { type: new GraphQLNonNull(GraphQLString) },
    lat: { type: new GraphQLNonNull(GraphQLFloat) },
    lng: { type: new GraphQLNonNull(GraphQLFloat) },
    date: { type: new GraphQLNonNull(GraphQLString) },
    type: { type: new GraphQLNonNull(GraphQLString) },
    size: { type: GraphQLString },
    extras: { type: new GraphQLList(GraphQLString) },
    comments: { type: GraphQLString },
    status: { type: new GraphQLNonNull(GraphQLString) },
    price: { type: new GraphQLNonNull(GraphQLFloat) },
    paymentToken: { type: GraphQLString },
    createdAt: { type: new GraphQLNonNull(GraphQLString) },
    updatedAt: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export default ServiceType;
