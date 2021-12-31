// ////test//////////
const _ = require('lodash')
const request = require('request')


const clientId = process.env.LINKEDIN_CLIENT_ID
const secret = process.env.LINKEDIN_CLIENT_SECRET


export const getAccessToken = async (authCode) => {
  return new Promise((resolve) => {
    request({
      url: 'https://www.linkedin.com/oauth/v2/accessToken',
      method: 'GET',
      qs: {
        grant_type: 'authorization_code',
        code: authCode,
        redirect_uri: process.env.LINKEDIN_CALLBACK_URL,
        client_id: clientId,
        client_secret: secret
      }
    }, (err, res, body) => {
      const data = JSON.parse(body)
      if (data && data.access_token) {
        return resolve(data.access_token)
      }
      console.log(`Linkedin get token ${JSON.stringify(data)}`)
      resolve(null)
    })
  })
}

export const getProfile = async (authCode) => {
  return new Promise(async (resolve) => {
    const accessToken = await getAccessToken(authCode)
    if (!accessToken) {
      return resolve(null)
    }
    const options = {
      url: 'https://api.linkedin.com/v2/me',
      method: 'GET',
      qs: {
        projection: '(id,localizedFirstName,localizedLastName,profilePicture(displayImage~digitalmediaAsset:playableStreams))'
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'cache-control': 'no-cache',
        'X-Restli-Protocol-Version': '2.0.0'
      }
    };
    request(options, async (err, res, body) => {
      const data = JSON.parse(body)
      if (data && data.id) {
        data.email = await getEmail(accessToken)
        return resolve(syncDataFields(data))
      }
      console.log(`Linkedin getme: ${JSON.stringify(data)}`)
      resolve(null)
    })
  })
}


export const getEmail = async (accessToken) => {
  return new Promise(async (resolve) => {
    const options = {
      url: 'https://api.linkedin.com/v2/emailAddress',
      method: 'GET',
      qs: {
        q: 'members',
        projection: '(elements*(handle~))',
        oauth2_access_token: accessToken
      }
    };
    request(options, (err, res, body) => {
      const data = JSON.parse(body)
      if (data) {
        const email = _.get(data, 'elements[0].handle~.emailAddress', null)
        return resolve(email)
      }
      console.log(`Linkedin get email:${JSON.stringify(data)}`)
      resolve(null)
    })
  })
}

const syncDataFields = (data) => {
  const rs = {
    id: data.id,
    firstName: data.localizedFirstName,
    lastName: data.localizedLastName,
    email: data.email,
    avatar: getImage(data)
  }
  return rs
}


const getImage = (data) => {
  const pictures = _.get(data, "profilePicture['displayImage~'].elements", [])
  const pictureIndentity = pictures.find((f) => {
    const withSize = _.get(f, 'data["com.linkedin.digitalmedia.mediaartifact.StillImage"].displaySize.width', null)
    return withSize === 400
  })

  return _.get(pictureIndentity, 'identifiers[0].identifier', null)
}

// https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=86wfypntj7tawd&scope=r_liteprofile%20r_emailaddress&state=123456&redirect_uri=http://localhost:3000
