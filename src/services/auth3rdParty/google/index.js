// ////test//////////
const { OAuth2Client } = require('google-auth-library');

const key = process.env.GOOGLE_CLIENT_ID
const client = new OAuth2Client(key);


export const getProfile = async (socialIdToken) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: socialIdToken,
      audience: [key]
    })

    return syncDataFields(ticket.getPayload())
  } catch (error) {
    console.log(`Error to verify google token: ${JSON.stringify(error)}`)
    return null
  }
}


const syncDataFields = (data) => {
  const rs = {
    id: data.sub,
    firstName: data.name,
    lastName: null,
    email: data.email,
    avatar: data.picture,
    profileUrl: `https://mail.google.com/mail/u/0/?fs=1&to=${data.email}&tf=cm`
  }

  return rs
}

