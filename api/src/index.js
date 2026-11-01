// Imports
import 'babel-polyfill';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import { graphql } from 'graphql';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import Debug from 'debug';
import sendGrid from '@sendgrid/mail';

// App Imports
import config from './config';
import authentication from './authentication';
import schema from './schema';
import payments from './payments';
import facebookDataDeleteConfirmation from './facebookDataDeleteConfirmation';
import admin, { ACTIONS } from './admin';

sendGrid.setApiKey(config.sendGridApiKey);

const debug = Debug('main');

debug('SETUP - Express...');

// Create express server
const server = express();

// Security
server.use(helmet());

// Enable CORS
server.use(cors());

// Request body parser
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({
  extended: false,
}));

// Request body cookie parser
server.use(cookieParser());

// HTTP logger
server.use(morgan('tiny'));

server.get('/admin', (req, res) => {
  if (typeof req.query.action !== 'string') {
    res.sendStatus(404);
    return;
  } else if (!Object.keys(ACTIONS).includes(req.query.action)) {
    res.sendStatus(404);
    return;
  }
  if (typeof req.query.token !== 'string' || req.query.action.length < 10) {
    res.sendStatus(404);
    return;
  }
  graphql({
    schema,
    source: ACTIONS[req.query.action],
    variableValues: { token: req.query.token },
  }).then((response) => {
    debug(response);
    if (response.errors) {
      res.send(admin(`${response.errors[0].message}. If this is a technical error please email the Admin`));
    } else {
      res.send(admin('Action was Successful! Please Close This Page.'));
    }
  }).catch((error) => {
    debug(error);
  });
});

server.get('/payments', (req, res) => {
  res.send(payments(config.stripePublicKey));
});

server.post('/facebookdatadelete', (req, res) => {
  const confCode = Math.random().toString(36).substring(2, 15);
  res.json({
    url: `https://api.mowgosnowgo.com/facebookdatadeleteconfirmation?confCode=${confCode}`,
    confirmation_code: confCode,
  });
});

server.get('/facebookdatadeleteconfirmation', (req, res) => {
  res.send(facebookDataDeleteConfirmation);
});

// Setup Authentication
debug('SETUP - Authentication...');

server.use(authentication); // ENDPOINTS DEFINED BEYOND THIS POINT ARE AUTHENTICATED

// Setup GraphQL
debug('SETUP - GraphQL...');

// API (GraphQL on route `/`)
server.use(config.graphql.endpoint, graphqlHTTP(request => ({
  schema,
  graphiql: config.graphql.ide,
  pretty: config.graphql.pretty,
  context: {
    auth: {
      user: request.user,
    },
  },
})));

// Start server
debug('SETUP - Starting server...');

// Start web server
server.listen(config.port, (error) => {
  if (error) {
    debug('ERROR - Unable to start server.');
  } else {
    debug(`INFO - Server started on port ${config.port}.`);
  }
});

