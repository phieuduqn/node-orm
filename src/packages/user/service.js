/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
import moment from 'moment'
import _ from 'lodash'
import uuid from 'uuid'
import repo from './repository'
import config from './config'
import { buildUpdateUserAfterLogin } from './query-builder'
import method from './method'
import { genTokenObject } from '../../utils/gen-token'
import utilsValidate from '../../utils/validation'
import { commonLocale, validationLocale } from '../../locales'
import to from '../../utils/to'
import { genEmailVerifyCode } from '../../utils/random-code'
import { sendMailVerify, sendMailForgotPwd } from '../../services/email/nodemailer'
import * as authen3rdPartyService from '../../services/auth3rdParty'
import userSocialRepo from '../userSocial/repository'
import notificationService from '../notification/service'
import notificationConfig from '../notification/config'

/**
 * Check existed account phone or email
 * @param {*} body
 */
async function checkExistAccount(body) {
  const emailUser = await repo.findOne({
    email: body.email.toLowerCase().trim(),
  })
  if (emailUser) {
    throw new Error(JSON.stringify(validationLocale.email.existedEmail))
  }

  return true
}

/**
 * Sign up by email
 * @param {*} body
 */
async function signUp(body) {
  const emailUser = body.email.toLowerCase().trim();
  if (!utilsValidate.isEmail(emailUser)) throw new Error(JSON.stringify(validationLocale.email.emailInvalid))
  await checkExistAccount(body)
  const [error, _doc] = await to(repo.create(body))
  if (error) {
    throw new Error(JSON.stringify(commonLocale.somethingWrong))
  }
  delete _doc.password
  const code = genEmailVerifyCode()
  const expiredTime = moment().add(config.VERIFY_EMAIL_OTP_TIME, 'minutes')
  await repo.createVerifyEmail(emailUser, code, expiredTime)
  // TODO Send email verify
  sendMailVerify(_doc, code, expiredTime)

  return _doc
}

/**
 *
 * @param {*} body
 * @param {*} accessor  ip, browser
 * @returns
 */
async function loginByEmail(body, accessor = {}) {
  const user = await repo.findOne({
    email: body.email.toLowerCase().trim(),
  })
  if (!user) {
    throw new Error(JSON.stringify(commonLocale.loginFailed))
  }

  if (user.isDeleted) {
    throw new Error(JSON.stringify(commonLocale.loginFailed))
  }

  if (!user.isVerifiedEmail) {
    return user.dataValues
    // throw new Error(JSON.stringify(validationLocale.email.emailNotVerified))
  }

  const { isBlocked, errorBlocked } = validateBlockedUser(user)
  if (isBlocked) {
    throw new Error(JSON.stringify(errorBlocked))
  }


  if (!method.comparePassword(body.password, user.password)) {
    throw new Error(JSON.stringify(commonLocale.loginFailed))
  }
  const resultToken = genTokenObject(user._id, user.email, user._v)
  const [error, updated] = await to(repo.updateOne(user._id, buildUpdateUserAfterLogin(resultToken, body)))
  if (error || !updated) {
    throw new Error(JSON.stringify(commonLocale.somethingWrong))
  }
  delete user.password
  const authenData = { ...user.dataValues, ...buildUpdateUserAfterLogin(resultToken, body), ...resultToken }
  repo.createOrUpdateUserAccess({
    email: body.email,
    token: resultToken.accessToken,
    ...accessor
  })

  return authenData
}

async function index(query) {
  return repo.findAll(query)
}

async function show(id) {
  return repo.findById(id)
}

const verifyEmailOTP = async (body = {}, accessor = {}) => {
  const [user, verifyEmail] = await Promise.all([
    repo.findOne({ email: body.email }),
    repo.findOneVerifyEmailSeq({
      email: body.email,
      code: body.code,
      isActive: true
    })
  ])
  if (!user) {
    throw new Error(JSON.stringify(validationLocale.email.emailNoneRegister))
  }
  if (!verifyEmail) {
    throw new Error(JSON.stringify(validationLocale.email.incorrectCode))
  }
  const now = moment()
  const mmExpireTime = moment(verifyEmail.expiredTime)
  if (now.isAfter(mmExpireTime)) {
    throw new Error(JSON.stringify(validationLocale.email.expiredCode))
  }
  const resultToken = genTokenObject(user._id, user.email, user._v)
  const updateUser = {
    lastLogin: moment().toDate(),
    status: config.status.active,
    isVerifiedEmail: true
  }
  await repo.updateVerifyEmailSeq(body.email, { isActive: false })
  await repo.updateOne({ email: body.email }, updateUser)
  delete user.password
  const authenData = { ...user.dataValues, ...updateUser, ...resultToken }
  repo.createOrUpdateUserAccess({
    email: body.email,
    token: resultToken.accessToken,
    ...accessor
  })
  sendNotiFirstSignup(user)

  return authenData
}

const logout = (body = {}, user = {}) => {
  return true
}

async function verifyIdentity(_id, body, user) {
  const { step, identityBefore, identityAfter, identityImageWithOtp } = body
  const userData = await repo.findById(_id)
  if (!userData) {
    throw new Error(JSON.stringify(validationLocale.user.notExistUser))
  }
  if (!userData.isVerifiedEmail) {
    throw new Error(JSON.stringify(validationLocale.email.emailNotVerified))
  }
  if (userData.kycStatus === config.kycStatus.submitted) {
    throw new Error(JSON.stringify(commonLocale.requestProcessing))
  }
  if (userData.kycStatus === config.kycStatus.verified) {
    return userData
  }
  const update = {}
  if (step === 1) {
    update.identityBefore = identityBefore
    update.identityAfter = identityAfter
    const code = genEmailVerifyCode()
    const expiredTime = moment().add(config.VERIFY_EMAIL_OTP_TIME, 'minutes')
    await repo.updateVerifyEmailSeq(userData.email, {
      email: userData.email,
      code,
      isActive: true,
      expiredTime
    })
    update.verifyIdentityOTP = code
  } else if (step === 2) {
    update.identityImageWithOtp = identityImageWithOtp
    update.kycStatus = config.kycStatus.submitted
  }
  await repo.updateOne({ _id }, update)

  return repo.findById(_id)
}


const isValidOTP = async (email, code) => {
  const otpData = await repo.findOneVerifyEmailSeq({
    email,
    code,
    isActive: true
  })
  if (!otpData) {
    throw new Error(JSON.stringify(validationLocale.email.incorrectCode))
  }
  const now = moment()
  const mmExpireTime = moment(otpData.expiredTime)
  if (now.isAfter(mmExpireTime)) {
    throw new Error(JSON.stringify(validationLocale.email.expiredCode))
  }

  return true
}

const updateProfile = async (_id, body, user) => {
  await repo.updateOne({ _id }, body)

  return repo.findById(_id)
}

/**
 * Resend OTP include authentication
 * For Verify Identity
 * @param {*} body
 * @param {*} user
 * @returns
 */
const resendOTPIncludeAuthen = async (body, user) => {
  const { type } = body
  const userData = await repo.findOne({ email: user.email })
  if (!userData) {
    throw new Error(JSON.stringify(validationLocale.user.notExistUser))
  }
  const code = genEmailVerifyCode()
  const expiredTime = moment().add(config.VERIFY_EMAIL_OTP_TIME, 'minutes')
  await repo.updateVerifyEmailSeq(userData.email, {
    email: userData.email,
    code,
    isActive: true,
    expiredTime
  })
  switch (type) {
    case config.otpType.identity:
      if (userData.kycStatus === config.kycStatus.submitted) {
        throw new Error(JSON.stringify(commonLocale.requestProcessing))
      }
      if (userData.kycStatus === config.kycStatus.verified) {
        return true
      }
      return true // TODO send mail

    default:
      return false;
  }
}

/**
 * Resend OTP without authen
 * For Register Verify, Fotgot Password
 * @param {*} body
 * @returns
 */
const resendOTPWithOutAuthen = async (body) => {
  const { email, type } = body
  const userData = await repo.findOne({ email })
  if (!userData) {
    throw new Error(JSON.stringify(validationLocale.user.notExistUser))
  }
  const code = genEmailVerifyCode()
  const expiredTime = moment().add(config.VERIFY_EMAIL_OTP_TIME, 'minutes')
  await repo.updateVerifyEmailSeq(userData.email, {
    email: userData.email,
    code,
    isActive: true,
    expiredTime
  })
  switch (type) {
    case config.otpType.register:
      if (userData.isVerifiedEmail) {
        return true
      }
      sendMailVerify(userData, code, expiredTime)
      return true

    case config.otpType.forgot:
      if (!userData.isVerifiedEmail) {
        throw new Error(JSON.stringify(validationLocale.email.emailNotVerified))
      }
      sendMailForgotPwd(userData, code, expiredTime)
      return true
    default:
      return false;
  }
}


/**
 * You reset password by OTP
 * @param {*} body
 */
async function changePwd(body, accessor = {}) {
  const email = body.email.toLowerCase().trim()
  const emailUser = await repo.findOne({
    email,
  })
  if (!emailUser) {
    throw new Error(JSON.stringify(validationLocale.email.emailNoneRegister))
  }
  if (!emailUser.isVerifiedEmail) {
    throw new Error(JSON.stringify(validationLocale.email.emailNotVerified))
  }
  await isValidOTP(email, body.code)
  const resultToken = genTokenObject(emailUser._id, emailUser.email, emailUser._v + 1)
  const updateUser = {
    lastLogin: moment().toDate(),
    password: method.hashInputPassword(body.password),
    _v: emailUser._v + 1
  }
  await repo.updateVerifyEmailSeq(email, { isActive: false })
  await repo.updateOne({ email }, updateUser)
  delete emailUser.password
  const authenData = { ...emailUser.dataValues, ...updateUser, ...resultToken }
  repo.createOrUpdateUserAccess({
    email: body.email,
    token: resultToken.accessToken,
    ...accessor
  })

  return authenData
}

const getProfileSocial = async (body) => {
  const { type, token, oauth_verifier: oauthVerifier } = body
  let profile = null
  switch (type) {
    case config.accountType.google:
      profile = await authen3rdPartyService.google.getProfile(token)
      break
    case config.accountType.linkedin:
      profile = await authen3rdPartyService.linkedIn.getProfile(token)
      break
    case config.accountType.twitter:
      if (oauthVerifier) {
        profile = await authen3rdPartyService.twitter.getProfile(token, oauthVerifier)
      }
      break
    default:
      break
  }

  return profile
}


const loginSocial = async (body, accessor = {}) => {
  const profile = await getProfileSocial(body)
  if (!profile || !profile.email || !profile.id) {
    throw new Error(JSON.stringify(commonLocale.socialTokenVerifyFailed))
  }

  return loginWSocialHandler(body, accessor, profile)
}


const loginWSocialHandler = async (body, accessor, profile) => {
  const { type } = body
  let userSocial = null
  const { count, rows } = await userSocialRepo.findAll({ email: profile.email })
  const user = await repo.findOne({ email: profile.email })

  if (!user) {
    // Create new user, usersocial and return token
    const newUser = {
      email: profile.email,
      accountType: type,
      fullName: `${profile.firstName} ${profile.lastName || ''}`,
      avatar: profile.avatar,
      password: profile.id + type,
      status: config.status.active,
      isVerifiedEmail: true
    }
    const createData = await repo.create(newUser)
    await userSocialRepo.create(newUserSocial(createData._id, type, profile))
    const newUserCreated = await repo.findById(createData._id)

    sendNotiFirstSignup(newUserCreated.dataValues)

    return handleGenerateAccessToken(newUserCreated.dataValues, accessor)
  }
  const { dataValues: userData } = user

  if (userData.isDeleted) {
    throw new Error(JSON.stringify(validationLocale.user.notExistUser))
  }

  const { isBlocked, errorBlocked } = validateBlockedUser(userData)
  if (isBlocked) {
    throw new Error(JSON.stringify(validationLocale.email.existedEmail))
    // throw new Error(JSON.stringify(errorBlocked))
  }


  if (!count) {
    // NEW SOCIAL
    userSocial = newUserSocial(userData._id, type, profile)
  } else {
    const currentSocial = rows.find(f => f.alias === type)
    if (!currentSocial) {
      userSocial = newUserSocial(userData._id, type, profile)
    }
  }
  if (userSocial) {
    await userSocialRepo.create(userSocial)
  }
  // GENERATE TOKEN
  const userUpdated = await repo.findById(userData._id)


  return handleGenerateAccessToken(userUpdated.dataValues, accessor)
}

const sendNotiFirstSignup = async (user) => {
  await notificationService.sendNotification({
    toId: user._id,
    action: notificationConfig.NOTIFY_ACTION.createAccount,
    params: {
      referValue: user._id
    }
  }, user, {
    delay: notificationConfig.NOTIFY_ACTION.createAccount.delay
  })


  await notificationService.sendNotification({
    toId: user._id,
    action: notificationConfig.NOTIFY_ACTION.verifyAccount,
    params: {
      referValue: user._id
    }
  }, user, {
    delay: notificationConfig.NOTIFY_ACTION.verifyAccount.delay
  })

  await notificationService.sendNotification({
    toId: user._id,
    action: notificationConfig.NOTIFY_ACTION.editProfile,
    params: {
      referValue: user._id
    }
  }, user, {
    delay: notificationConfig.NOTIFY_ACTION.editProfile.delay,
  })

  notificationService.sendNotification({
    toId: user._id,
    action: notificationConfig.NOTIFY_ACTION.accountNotVerified,
    params: {
      referValue: user._id
    }
  }, user, {
    repeat: {
      cron: notificationConfig.NOTIFY_ACTION.accountNotVerified.cron,
      limit: 100
    },
    jobId: uuid.v4(), // jobid is cron job Id/.
    removeOnComplete: true
  })
}

const handleGenerateAccessToken = async (user, accessor = {}) => {
  const resultToken = genTokenObject(user._id, user.email, user._v)
  await repo.updateOne(user._id, buildUpdateUserAfterLogin(resultToken))
  delete user.password
  const authenData = { ...user, ...buildUpdateUserAfterLogin(resultToken), ...resultToken }
  repo.createOrUpdateUserAccess({
    email: user.email,
    token: resultToken.accessToken,
    ...accessor
  })

  return authenData
}

const newUserSocial = (userId, type, profile) => {
  const userSocial = {
    name: type,
    userId,
    email: profile.email,
    socialId: profile.id,
    firstName: profile.firstName,
    lastName: profile.lastName,
    profilePicture: profile.avatar,
    profileLink: profile.profileUrl
  }

  return userSocial
}


const twAuthToken = async () => {
  return authen3rdPartyService.twitter.getAuthToken()
}


/**
 *
 * @param {*} user
 * @returns {object}
 *  {isBlocked: true, errorBlocked: {message,code}}
 */
const validateBlockedUser = (user) => {
  if (!user.isBlocked) {
    return {
      isBlocked: false
    }
  }

  return {
    isBlocked: true,
    errorBlocked: validationLocale.user.accountBlocked
  }
}

const destroyUser = async (id) => {
  const user = await repo.findById(id)
  if (!user) {
    throw new Error(JSON.stringify(validationLocale.user.notExistUser))
  }
  // TODO UPDATE JOB FIELDS

  const data = await repo.destroyOne(id)

  return data
}


export default {
  index,
  show,
  // Auth
  signUp,
  loginByEmail,
  checkExistAccount,
  verifyEmailOTP,
  logout,
  verifyIdentity,
  updateProfile,
  resendOTPIncludeAuthen,
  resendOTPWithOutAuthen,

  isValidOTP,
  changePwd,
  loginSocial,
  twAuthToken,
  // CMS
  validateBlockedUser,
  destroyUser
}
