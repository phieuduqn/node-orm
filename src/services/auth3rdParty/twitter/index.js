/* eslint-disable no-unused-vars */
const oauth = require('oauth');

const {
  CONSUMER_KEY,
  CONSUMER_SECRET,
  CALLBACK_URL
} = require('./config')

const consumer = new oauth.OAuth(
  'https://twitter.com/oauth/request_token',
  'https://twitter.com/oauth/access_token',
  CONSUMER_KEY,
  CONSUMER_SECRET,
  '1.0A', CALLBACK_URL,
  'HMAC-SHA1'
);

export const getAuthToken = async () => {
  return new Promise((resolve) => {
    consumer.getOAuthRequestToken((error, oauthToken, oauthTokenSecret, results) => {
      if (error) {
        console.log(JSON.stringify(error))
        resolve({
          oauth_token: null,
          oauth_url: null
        });
      } else {
        resolve({
          oauth_token: oauthToken,
          oauth_url: `https://twitter.com/oauth/authorize?oauth_token=${oauthToken}`
        })
      }
    });
  })
};

export const getProfile = (oauthToken, oauthVerifier, oauthRequestTokenSecret) => {
  return new Promise((resolve, reject) => {
    consumer.getOAuthAccessToken(
      oauthToken, oauthRequestTokenSecret, oauthVerifier,
      async (error, oauthAccessToken, oauthAccessTokenSecret, results) => {
        if (error) {
          console.log(error);
          resolve(null)
        } else {
          consumer.get(
            'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
            oauthAccessToken, //  user token
            oauthAccessTokenSecret, //  user secret
            (e, body, res) => {
              if (e) {
                console.error(e);
                return resolve(null)
              }
              try {
                const data = JSON.parse(body)
                if (data && data.id) {
                  return resolve(syncDataFields(data))
                }
                resolve(null)
              } catch (errorParse) {
                resolve(null)
              }
            }
          );
        }
      }
    );
  })
}


const syncDataFields = (data) => {
  const rs = {
    id: data.id_str,
    firstName: data.name,
    lastName: null,
    email: data.email,
    avatar: data.profile_image_url_https,
    profileUrl: `https://twitter.com/${data.screen_name}`
  }
  return rs
}
