const authTokenCache = 'authen:token_'

const HOURS_TO_BLOCK = 2
const LOGIN_ATTEMPTS = 5
const AUTHEN_CACHE_EXPIRE = 30 * 24 * 60 * 60

const status = {
  active: 1,
  inactive: 0
}

const statusList = Object.values(status)

const gender = {
  male: 'male',
  female: 'female',
  other: 'other'
}
const genderList = Object.values(gender)

const ALLOWED_CREATE_ATTRIBUTE = [
  'fullName',
  'email',
  'password',
  'roleId',
  'allowSystemMessage'
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

const ALLOWED_UPDATE_ATTRIBUTE = [
  'fullName',
  'gender',
  'birthDay',
  'age',
  'avatar',
  'address'
];

const ALLOWED_ADMIN_UPDATE_ATTRIBUTE = [
  'status',
  'roleId',
  'allowSystemMessage'
];

const ALLOWED_UPDATE_PASSWORD_ATTRIBUTE = [
  'oldPassword',
  'password'
]

const ALLOWED_RESEND_OTP = [
  'email',
];

const ALLOW_RESET_PASSWORD = ['email', 'password', 'code']

const VERIFY_EMAIL_OTP_TIME = 5 // 5 minutes

export default {
  limit: {
    index: 20
  },
  status,
  statusList,
  gender,
  genderList,
  authTokenCache,
  ALLOWED_LOGIN_ATTRIBUTE,
  ALLOWED_LOGOUT_ATTRIBUTE,
  ALLOWED_CREATE_ATTRIBUTE,
  HOURS_TO_BLOCK,
  LOGIN_ATTEMPTS,
  ALLOWED_RESET_PASSWORD_ATTRIBUTE,
  AUTHEN_CACHE_EXPIRE,
  ALLOWED_UPDATE_ATTRIBUTE,
  ALLOWED_ADMIN_UPDATE_ATTRIBUTE,
  ALLOWED_UPDATE_PASSWORD_ATTRIBUTE,
  ALLOWED_RESEND_OTP,
  ALLOW_RESET_PASSWORD,
  VERIFY_EMAIL_OTP_TIME
}
