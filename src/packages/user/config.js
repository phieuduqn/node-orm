const authTokenCache = 'authen:token_'

const HOURS_TO_BLOCK = 2
const LOGIN_ATTEMPTS = 5
const AUTHEN_CACHE_EXPIRE = 30 * 24 * 60 * 60

const VERIFY_EMAIL_OTP_TIME = 5 // 5 minutes
const KEY_LIMIT_RESEND_OTP = 'send_email_code'
const KEY_LIMIT_CHANGE_PWD = 'change_password'
const KEY_LIMIT_CHECK_OTP = 'check_otp'
const KEY_LIMIT_GET_OAUTH_TWITTER_TOKEN = 'get_oauth_twitter_token'
const status = {
  active: 1,
  inactive: 0
}

const statusList = Object.values(status)

const accountType = {
  normal: 'normal',
  google: 'google',
  linkedin: 'linkedin',
  twitter: 'twitter',
}

const accountTypeList = Object.values(accountType)


const gender = {
  male: 'male',
  female: 'female',
  other: 'other'
}
const genderList = Object.values(gender)

const matchCode = {
  verified: 1,
  notverified: 2
}

const matchCodeList = Object.values(matchCode)

const otpType = {
  register: 'register',
  identity: 'identity',
  forgot: 'forgot',
}
const otpTypeList = Object.values(otpType)


const ALLOWED_CREATE_ATTRIBUTE = [
  'fullName',
  'email',
  'password'
];

const ALLOWED_LOGIN_ATTRIBUTE = [
  'email',
  'password'
];

const ALLOWED_LOGOUT_ATTRIBUTE = [
  'email'
];

const ALLOWED_RESET_PASSWORD_ATTRIBUTE = [
  'fullName',
  'email',
  'code',
  'password'
];

const keyLimitEmail = 'send_email_code'


const ALLOWED_UPDATE_ATTRIBUTE = [
  'fullName',
  'gender',
  'birthDay',
  'age',
  'avatar',
  'address'
];

const ALLOWED_VERIFY_IDENTITY = [
  'step',
  'verifyCode',
  'identityBefore',
  'identityAfter',
  'identityImageWithOtp',
];

const ALLOWED_RESEND_OTP = [
  'email',
  'type'
];


const basicUserInfo = [
  '_id',
  'email',
  'fullName',
  'avatar',
  'isVerifiedEmail',
  'status'
]


export default {
  limit: {
    index: 20
  },
  keyLimitEmail,
  status,
  statusList,
  gender,
  genderList,
  matchCode,
  matchCodeList,
  VERIFY_EMAIL_OTP_TIME,
  authTokenCache,
  ALLOWED_LOGIN_ATTRIBUTE,
  ALLOWED_LOGOUT_ATTRIBUTE,
  ALLOWED_CREATE_ATTRIBUTE,
  HOURS_TO_BLOCK,
  LOGIN_ATTEMPTS,
  ALLOWED_RESET_PASSWORD_ATTRIBUTE,
  AUTHEN_CACHE_EXPIRE,
  ALLOWED_UPDATE_ATTRIBUTE,
  ALLOWED_VERIFY_IDENTITY,
  KEY_LIMIT_RESEND_OTP,
  KEY_LIMIT_CHANGE_PWD,
  KEY_LIMIT_CHECK_OTP,
  KEY_LIMIT_GET_OAUTH_TWITTER_TOKEN,
  ALLOWED_RESEND_OTP,
  otpTypeList,
  otpType,
  basicUserInfo,
  accountType,
  accountTypeList
}
