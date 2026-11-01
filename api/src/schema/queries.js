// Imports
import { GraphQLObjectType } from 'graphql';

// App Imports
import * as user from '../modules/user/query';
import * as service from '../modules/service/query';

// Query
const query = new GraphQLObjectType({
  name: 'query',
  description: 'API Queries [Read]',
  fields: {
    ...user,
    ...service,
  },
});

export default query;
