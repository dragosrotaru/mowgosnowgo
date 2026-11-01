import { GraphQLError } from 'graphql';
import Debug from 'debug';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { emailErrorToDev } from '../helpers';
import config from '../../config';
import models from '../../models';

import userCreatedEmail from './userCreatedEmail';
import userForgotPasswordEmail from './userForgotPasswordEmail';

const debug = Debug('user');

function getUserToken(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
}

// User Create
export async function create(parentValue, {
  name, email, phone, password,
}) {
  debug('Checking if User Exists');
  try {
    let user = await models.User.findOne({
      where: {
        email,
      },
    });
    if (user) {
      debug('User already exists');
      throw new GraphQLError(`The email ${email} is already registered. Please try to login.`);
    }
    debug('User Does Not Already Exist');
    debug('Hashing Password');
    const passwordHashed = await bcrypt.hash(password, config.saltRounds);
    debug('Password Hashed');
    debug('Creating User');
    user = await models.User.create({
      name,
      email,
      phone,
      password: passwordHashed,
      role: 'user',
    });
    user = user.get();
    const result = {
      user,
      token: jwt.sign(getUserToken(user), config.secret),
    };
    debug('User Created: ');
    debug(result);
    debug('Sending Email');
    userCreatedEmail(user);
    return result;
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

// User Create Facebook
export async function createFacebook(parentValue, {
  name, email, phone, facebookToken,
}) {
  debug('Checking if User Exists');
  try {
    debug('Authenticating with Facebook');
    const facebookResponse = await axios(`https://graph.facebook.com/debug_token?input_token=${facebookToken}&access_token=${
      config.facebookAppID
    }|${config.facebookAppSecret}`);
    debug('Facebook Response:');
    debug(facebookResponse.data.data);
    if (!facebookResponse.data.data.is_valid) {
      debug('Authentication Failed');
      throw new GraphQLError('The Facebook Login User Token is invalid');
    }
    debug('Authentication Succeeded');
    const facebookID = facebookResponse.data.data.user_id;
    let user = await models.User.findOne({
      where: {
        facebookID,
      },
    });
    if (user) {
      debug(`User with FacebookID ${facebookID} already exists`);
      throw new GraphQLError('This Facebook user already signed up. Please try to login.');
    }
    user = await models.User.findOne({
      where: {
        email,
      },
    });
    if (user) {
      debug('User already exists');
      throw new GraphQLError(`The email ${email} is already registered. Please try to login.`);
    }
    debug('User Does Not Already Exist');
    debug('Creating User');
    user = await models.User.create({
      name,
      email,
      phone,
      facebookID,
      role: 'user',
    });
    user = user.get();
    const result = {
      user,
      token: jwt.sign(getUserToken(user), config.secret),
    };
    debug('User Created: ');
    debug(result);
    debug('Sending Email');
    userCreatedEmail(user);
    return result;
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

// User Login
export async function login(parentValue, { email, password }) {
  try {
    debug('Retrieving User');
    let user = await models.User.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      debug("User Doesn't Exist");
      throw new GraphQLError('We do not have any user registered with that email address. Please signup!');
    }
    user = user.get();
    const result = {
      user,
      token: jwt.sign(getUserToken(user), config.secret),
    };
    debug('User Retrieved: ');
    debug(result);

    if (user.facebookID) {
      throw new GraphQLError('Please use Facebook to Login.');
    }

    debug('Checking Password');
    const passwordMatch = await bcrypt.compare(password, user.password);

    // Incorrect password
    if (!passwordMatch) {
      debug('Password Doesnt Match');
      throw new GraphQLError('Sorry, the password you entered is incorrect. Please try again.');
    }
    debug('Password Matched');
    return result;
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

// User Login Facebook
export async function loginFacebook(parentValue, { facebookToken }) {
  try {
    debug('Authenticating with Facebook');
    const facebookResponse = await axios(`https://graph.facebook.com/debug_token?input_token=${facebookToken}&access_token=${
      config.facebookAppID
    }|${config.facebookAppSecret}`);
    debug('Facebook Response:');
    debug(facebookResponse.data.data);
    if (!facebookResponse.data.data.is_valid) {
      debug('Authentication Failed');
      throw new GraphQLError('The Facebook Login User Token is invalid');
    }
    debug('Authentication Succeeded');
    const facebookID = facebookResponse.data.data.user_id;
    debug('Retrieving User');
    let user = await models.User.findOne({
      where: {
        facebookID,
      },
    });
    if (!user) {
      debug("User Doesn't Exist");
      return false;
    }
    user = user.get();
    const result = {
      user,
      token: jwt.sign(getUserToken(user), config.secret),
    };
    debug('User Retrieved: ');
    debug(result);
    return result;
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

// User Forgot Password
export async function forgotPassword(parentValue, { email }) {
  try {
    debug('Retrieving User');
    let user = await models.User.findOne({ where: { email } });
    if (!user) {
      debug('User Not Found');
      throw new GraphQLError('We do not have any user registered with that email address.');
    }
    debug('User Retrieved: ');
    user = user.get();
    debug(user);
    userForgotPasswordEmail(user);
    return user.id;
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

// User Get by ID
export async function getByID(parentValue, { id }, { auth }) {
  try {
    if (auth.user === null || auth.user.role !== 'admin' || auth.user.id !== id) {
      throw new GraphQLError('Access Denied.');
    }
    debug('Retrieving User');
    let user = models.User.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      debug('User Not Found');
      throw new GraphQLError('We do not have any user registered with that email address.');
    }
    user = user.get();
    debug('User Retrieved: ');
    debug(user);
    return user;
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

// User Get by Token
export async function getByToken(parentValue, {}, { auth }) {
  try {
    const user = await models.User.findOne({ where: { id: auth.user.id } });
    return user.get();
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

// User Get All
export async function getAll(parentValue, {}, { auth }) {
  try {
    // Authentication
    if (auth.user === null || auth.user.role !== 'admin') {
      throw new GraphQLError('Access Denied.');
    }
    const users = await models.User.findAll();
    return users;
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

/* // User Update
export async function update(parentValue, {
  id,
  name,
  email,
  phone,
}, { auth }) {
  try {
    // Authentication
    if (auth.user === null || auth.user.role !== 'admin') {
      throw new GraphQLError('Access Denied.');
    }

  } catch (error) {
    debug(error.message);
    if (error.name === 'GraphQLError') {
      throw error;
    } else {
      emailErrorToDev(error);
      throw new Error('Server Error. Administrator Has Been Contacted');
    }
  }
} */

// User Remove
export async function remove(parentValue, { id }, { auth }) {
  try {
    // Authentication
    if (auth.user === null || auth.user.role !== 'admin') {
      throw new GraphQLError('Access Denied.');
    }
    const user = await models.User.destroy({ where: { id } });
    return user;
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
