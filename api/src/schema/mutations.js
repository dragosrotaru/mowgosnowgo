// Imports
import { GraphQLObjectType } from 'graphql';

// App Imports
import * as user from '../modules/user/mutations';
import * as service from '../modules/service/mutations';

// Mutation
const mutation = new GraphQLObjectType({
  name: 'mutation',
  description: 'API Mutations [Create, Update, Delete]',
  fields: {
    ...user,
    ...service,
  },
});

export default mutation;
