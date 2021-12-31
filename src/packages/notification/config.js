

const TOPIC = 'notification'

const REFER_ACTION = {
  redirect: 'redirect',
  popup: 'popup',
}

const PAGE = {
  profile: 'profile',
  contact: 'contact'
}


const NOTIFY_ACTION = {
  createAccount: {
    value: 'createAccount',
    labels: ['info', 'success'],
    page: PAGE.profile,
    referAction: REFER_ACTION.redirect,
    delay: 5000
  },
  verifyAccount: {
    value: 'verifyAccount',
    labels: ['info'],
    page: PAGE.profile,
    referAction: REFER_ACTION.redirect,
    delay: 7000
  },
  editProfile: {
    value: 'editProfile',
    labels: ['info'],
    page: PAGE.profile,
    referAction: REFER_ACTION.redirect,
    delay: 9000
  },
  accountVerified: {
    value: 'accountVerified',
    labels: ['success'],
    page: PAGE.profile,
    referAction: REFER_ACTION.redirect
  },
  accountNotVerified: {
    value: 'accountNotVerified',
    labels: ['warning'],
    page: PAGE.profile,
    referAction: REFER_ACTION.redirect,
    cron: '15 0 */5 * *'// '0 1 */5 * *' // 8 AM every 5 days
  }
}


export default {
  NOTIFY_ACTION,
  REFER_ACTION,
  TOPIC
}
