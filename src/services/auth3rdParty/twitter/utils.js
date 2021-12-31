/* eslint-disable max-len */
/* eslint-disable no-plusplus */
const crypto = require('crypto');
const {
  CONSUMER_KEY,
  CONSUMER_SECRET,
} = require('./config')

const API_URL = 'https://api.twitter.com/oauth/request_token'

export const nonceHash = () => {
  return encodeURIComponent(crypto.randomBytes(32).toString('base64'));
}

export const parseHeaderString = (params) => {
  let headerString = 'OAuth ';
  const headerStringParams = Object.keys(params);
  for (let i = 0; i < headerStringParams.length; i++) {
    const param = headerStringParams[i];
    headerString += `${encodeURIComponent(param)}="${encodeURIComponent(params[param])}"`;

    if (i < headerStringParams.length - 1) {
      headerString += ', ';
    }
  }

  return headerString
}


export const getNewSignature = (params) => {
  let signatureString = '';
  const paramKeys = Object.keys(params);

  for (let i = 0; i < paramKeys.length; i++) {
    const param = paramKeys[i];
    signatureString += `${encodeURIComponent(param)}=${encodeURIComponent(params[param])}`;
    if (i < paramKeys.length - 1) {
      signatureString += '&';
    }
  }

  const signatureBaseString = `${encodeURIComponent('POST')}&${encodeURIComponent(API_URL)}&${encodeURIComponent(signatureString)}`;
  const signingKey = `${encodeURIComponent(CONSUMER_KEY)}&${encodeURIComponent(CONSUMER_SECRET)}`;
  const signature = crypto.createHmac('sha1', signingKey).update(signatureBaseString).digest('base64');

  return encodeURIComponent(signature);
}

