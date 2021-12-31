/* eslint-disable no-unused-vars */
import { verify } from 'jsonwebtoken';
import config from '../configs';

const authenticate = async (socket, data, next) => {
  const {
    token
  } = data
  if (token) {
    await verify(token, config.secret, async (error, decoded) => {
      if (error) {
        return socket.disconnect(0);
      }
      if (typeof decoded === 'string') {
        decoded = JSON.parse(decodeURIComponent(decoded))
      }
      if (typeof decoded.id === 'undefined') {
        return socket.disconnect(0);
      }
      data.senderId = decoded.id
      next(socket, data)
    });
  } else {
    return socket.disconnect(0);
  }
};

const authen = (token, callback) => {
  if (token) {
    verify(token, config.secret, async (error, decoded) => {
      if (error) {
        return callback()
      }
      if (typeof decoded === 'string') {
        decoded = JSON.parse(decodeURIComponent(decoded))
      }
      if (typeof decoded.id === 'undefined') {
        return callback()
      }
      callback(decoded)
    });
  } else {
    callback();
  }
};
module.exports = {
  authenticate,
  authen
}
