import moment from 'moment';
import Stripe from 'stripe';
import Debug from 'debug';
import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import models from '../../models';
import config from '../../config';
import { emailErrorToDev } from '../helpers';
import serviceRequestedEmail from './serviceRequestedEmail';
import serviceApprovedEmail from './serviceApprovedEmail';
import serviceDeniedEmail from './serviceDeniedEmail';
import serviceCancelledByProviderEmail from './serviceCancelledByProviderEmail';
import serviceCancelledByUserEmail from './serviceCancelledByUserEmail';
import serviceCompletedEmail from './serviceCompletedEmail';
import paymentFailedEmail from './paymentFailedEmail';

const stripe = Stripe(config.stripePrivateKey);
const debug = Debug('service');

// Service Get All
export async function getAll(parentValue, {}, { auth }) {
  try {
    debug('Authenticating');
    if (auth.user === null || auth.user.role !== 'admin') {
      debug('Authentication Failed');
      throw new GraphQLError('Access Denied.');
    }
    debug('Authenticated');
    return await models.Service.findAll({
      include: [
        { model: models.User, as: 'user' },
      ],
    });
  } catch (error) {
    debug(error.message);
    if (error.name === 'GraphQLError') {
      throw error;
    } else {
      emailErrorToDev(error);
      throw new Error('Server Error. Administrator Has Been Contacted');
    }
  }
}


// Service Get All By User Token
export async function getAllByUserToken(parentValue, {}, { auth }) {
  try {
    debug('Authenticating');
    if (auth.user === null) {
      debug('Authentication Failed');
      throw new GraphQLError('Access Denied.');
    }
    debug('Authenticated');
    return await models.Service.findAll({
      where: {
        userId: auth.user.id,
      },
      include: [
        { model: models.User, as: 'user' },
      ],
    });
  } catch (error) {
    debug(error.message);
    if (error.name === 'GraphQLError') {
      throw error;
    } else {
      emailErrorToDev(error);
      throw new Error('Server Error. Administrator Has Been Contacted');
    }
  }
}

// Service Get By ID
export async function getByID(parentValue, { id }, { auth }) {
  try {
    debug('Authenticating');
    if (auth.user === null) {
      debug('Authentication Failed');
      throw new GraphQLError('Access Denied.');
    }
    debug('Authenticated');
    const service = await models.Service.findOne({
      where: { id },
      include: [
        { model: models.User, as: 'user' },
      ],
    });
    debug('Authorizing');
    if (service.userId !== auth.user.id && auth.user.role !== 'admin') {
      debug('Authorization Failed');
      throw new GraphQLError('Access Denied.');
    }
    debug('Authorized');
    return service;
  } catch (error) {
    debug(error.message);
    if (error.name === 'GraphQLError') {
      throw error;
    } else {
      emailErrorToDev(error);
      throw new Error('Server Error. Administrator Has Been Contacted');
    }
  }
}

// Service Create
export async function create(parentValue, {
  address,
  mapsURL,
  lat,
  lng,
  date,
  type,
  size,
  extras,
  comments,
  price,
  paymentToken,
}, { auth }) {
  try {
    debug('Authenticating');
    if (auth.user === null) {
      debug('Authentication Failed');
      throw new GraphQLError('Access denied.');
    }
    debug('Authenticated');
    if (paymentToken !== '') {
      const customer = await stripe.customers.list({ limit: 1, email: auth.user.email });
      if (customer.data.length === 0) {
        await stripe.customers.create({
          email: auth.user.email,
          source: JSON.parse(paymentToken).source.id,
        });
      } else {
        await stripe.customers.createSource(
          customer.data[0].id,
          { source: JSON.parse(paymentToken).source.id },
        );
      }
    }
    const serviceTemp = await models.Service.create({
      userId: auth.user.id,
      address,
      mapsURL,
      lat,
      lng,
      date,
      type,
      size,
      extras,
      price,
      paymentToken,
      comments,
      status: 'Requested',
    });
    const service = await models.Service.findOne({
      where: { id: serviceTemp.id },
      include: [
        { model: models.User, as: 'user' },
      ],
    });
    serviceRequestedEmail(service);
    return service.get();
  } catch (error) {
    debug(error.message);
    if (error.name === 'GraphQLError') {
      throw error;
    } else {
      emailErrorToDev(error);
      throw new Error('Server Error. Administrator Has Been Contacted');
    }
  }
}

// Service Cancel By ID
export async function cancelByID(parentValue, { id }, { auth }) {
  try {
    debug('Authenticating');
    if (auth.user === null) {
      debug('Authentication Failed');
      throw new GraphQLError('Access denied.');
    }
    debug('Authenticated');
    const service = await models.Service.findOne({
      where: {
        id,
      },
      include: [{
        model: models.User,
        as: 'user',
      }],
    });
    // Service Found
    if (service === null) {
      throw new GraphQLError('Service Not Found.');
    }
    if (service.status === 'Approved' || service.status === 'Requested') {
      const shouldCharge = service.price !== 0 && moment(service.createdAt).add(24, 'h').isSameOrBefore(moment());
      // Update, Email
      await models.Service.update({
        status: 'Cancelled By User',
      }, {
        where: {
          id,
        },
      });
      serviceCancelledByUserEmail(service, shouldCharge);
      // Payment
      if (shouldCharge) {
        try {
          const customer = await stripe.customers.list({
            limit: 1,
            email: service.user.email,
          });
          await stripe.charges.create({
            amount: 2000,
            currency: 'cad',
            customer: customer.data[0].id,
            source: JSON.parse(service.paymentToken).source.id,
            description: `Cancellation Charge for ${service.type} at ${service.address}`,
          });
        } catch (error) {
          debug('PAYMENT FAILED: ', error);
          emailErrorToDev(error);
          paymentFailedEmail(service);
        }
      }
      return service;
    }
    throw new GraphQLError(`Service Cannot Be Cancelled. Current Status: ${service.status}`);
  } catch (error) {
    debug(error.message);
    if (error.name === 'GraphQLError') {
      throw error;
    } else {
      emailErrorToDev(error);
      throw new Error('Server Error. Administrator Has Been Contacted');
    }
  }
}

// Service Cancel By Token
export async function cancelByToken(parentValue, { token }) {
  debug('resolver: ', 'cancelByToken');
  let params;
  let service;

  // Authentication
  try {
    params = jwt.verify(token, config.secret);
  } catch (error) {
    throw new Error('Access Denied.');
  }

  // Retrieve Service From DB
  try {
    service = await models.Service.findOne({
      where: { id: params.id },
      include: [
        { model: models.User, as: 'user' },
      ],
    });
  } catch (error) {
    emailErrorToDev(error);
    throw new Error('Server Error. Administrator Has Been Contacted');
  }

  // Service Found
  if (service === null) {
    throw new Error('Service Not Found.');
  }

  // Update, Email and Return
  if (service.status === 'Requested' || service.status === 'Approved') {
    try {
      await models.Service.update({ status: 'Cancelled By Provider' }, { where: { id: params.id } });
      serviceCancelledByProviderEmail(service);
      return service;
    } catch (error) {
      emailErrorToDev(error);
      throw new Error('Server Error. Administrator Has Been Contacted');
    }
  }
  throw new Error(`Service Cannot Be Cancelled. Current Status: ${service.status}`);
}

// Service Complete By Token
export async function completeByToken(parentValue, { token }) {
  debug('resolver: ', 'completeByToken');
  let params;
  let service;

  // Authentication
  try {
    params = jwt.verify(token, config.secret);
  } catch (error) {
    throw new Error('Access Denied.');
  }

  // Retrieve Service From DB
  try {
    service = await models.Service.findOne({
      where: { id: params.id },
      include: [
        { model: models.User, as: 'user' },
      ],
    });
  } catch (error) {
    emailErrorToDev(error);
    throw new Error('Server Error. Administrator Has Been Contacted');
  }

  // Service Found
  if (service === null) {
    throw new Error('Service Not Found.');
  }

  if (service.status === 'Approved') {
    const shouldCharge = service.price !== 0;

    // Update, Email
    try {
      await models.Service.update({ status: 'Completed' }, { where: { id: params.id } });
      serviceCompletedEmail(service, shouldCharge);
    } catch (error) {
      emailErrorToDev(error);
      throw new Error('Server Error. Administrator Has Been Contacted');
    }

    // Payment
    if (shouldCharge) {
      try {
        const customer = await stripe.customers.list({ limit: 1, email: service.user.email });
        await stripe.charges.create({
          // STRIPE CHARGES IN CENTS. TAX NOT INCLUDED
          amount: Math.round(service.price * 100 * 1.13),
          currency: 'cad',
          customer: customer.data[0].id,
          source: JSON.parse(service.paymentToken).source.id,
          description: `Charge for ${service.type} Service at ${service.address}`,
        });
      } catch (error) {
        debug('PAYMENT FAILED: ', error);
        emailErrorToDev(error);
        paymentFailedEmail(service);
      }
    }
    return service;
  }
  throw new Error(`Service Cannot Be Completed. Current Status: ${service.status}`);
}

// Service Approve By Token
export async function approveByToken(parentValue, { token }) {
  debug('resolver: ', 'approveByToken');
  let params;
  let service;

  // Authentication
  try {
    params = jwt.verify(token, config.secret);
  } catch (error) {
    throw new Error('Access Denied.');
  }

  // Retrieve Service From DB
  try {
    service = await models.Service.findOne({
      where: { id: params.id },
      include: [
        { model: models.User, as: 'user' },
      ],
    });
  } catch (error) {
    emailErrorToDev(error);
    throw new Error('Server Error. Administrator Has Been Contacted');
  }

  // Service Found
  if (service === null) {
    throw new Error('Service Not Found.');
  }

  // Update, Email and Return
  if (service.status === 'Requested') {
    try {
      await models.Service.update({ status: 'Approved' }, { where: { id: params.id } });
      serviceApprovedEmail(service);
      return service;
    } catch (error) {
      emailErrorToDev(error);
      throw new Error('Server Error. Administrator Has Been Contacted');
    }
  }
  throw new Error(`Service Cannot Be Approved. Current Status: ${service.status}`);
}

// Service Approve By Token
export async function denyByToken(parentValue, { token }) {
  debug('resolver: ', 'denyByToken');
  let params;
  let service;

  // Authentication
  try {
    params = jwt.verify(token, config.secret);
  } catch (error) {
    throw new Error('Access Denied.');
  }

  // Retrieve Service From DB
  try {
    service = await models.Service.findOne({
      where: { id: params.id },
      include: [
        { model: models.User, as: 'user' },
      ],
    });
  } catch (error) {
    emailErrorToDev(error);
    throw new Error('Server Error. Administrator Has Been Contacted');
  }

  // Service Found
  if (service === null) {
    throw new Error('Service Not Found.');
  }

  // Update, Email and Return
  if (service.status === 'Requested') {
    try {
      await models.Service.update({ status: 'Denied' }, { where: { id: params.id } });
      serviceDeniedEmail(service);
      return service;
    } catch (error) {
      emailErrorToDev(error);
      throw new Error('Server Error. Administrator Has Been Contacted');
    }
  }
  throw new Error(`Service Cannot Be Denied. Current Status: ${service.status}`);
}
