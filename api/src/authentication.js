// Imports
import jwt from 'jsonwebtoken';
import config from './config';

// Authentication middleware
export default function (request, response, next) {
  const authToken = request.headers.authorization;
  if (authToken && authToken !== null) {
    try {
      const token = authToken.split(' ');
      request.user = jwt.verify(token[1], config.secret);
    } catch (e) {
      throw new Error('Invalid token detected.');
    }
  } else {
    // request.user = {id: 1, role: 'admin'}; // WARNING
    request.user = null;
  }
  next();
}
