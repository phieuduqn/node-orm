/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
import moment from 'moment'
import repo from './repository'
import config from './config'
import configs from '../../configs'
import { buildUpdateUserAfterLogin } from './query-builder'
import method from './method'
import { genTokenObject } from '../../utils/gen-token'
import utilsValidate from '../../utils/validation'
import { commonLocale, validationLocale } from '../../locales'
import to from '../../utils/to'
import { genEmailVerifyCode } from '../../utils/random-code'
import { sendMailForgotPwd } from '../../services/email/nodemailer'

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

  if (user.status === config.status.inactive) {
    throw new Error(JSON.stringify(validationLocale.user.accountBlocked))
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
  const authenData = { ...user.dataValues, ...resultToken }

  return authenData
}

async function index(query) {
  return repo.findAll(query)
}

async function show(id) {
  return repo.findById(id)
}

const update = async (_id, body, user = {}) => {
  const updateUser = await repo.findById(_id)
  if (!updateUser) {
    throw new Error(JSON.stringify(validationLocale.user.notExistUser))
  }
  const { roleId } = user

  if (body.roleId && body.roleId == configs.superAdminRoleId && roleId != configs.superAdminRoleId) {
    throw new Error(JSON.stringify(commonLocale.forbidden))
  }


  await repo.updateOne({ _id }, body)

  return repo.findById(_id)
}

const logout = (body = {}, user = {}) => {
  return true
}

const updateProfile = async (_id, body) => {
  await repo.updateOne({ _id }, body)

  return repo.findById(_id)
}

async function changePwd(body, user) {
  const moderator = await repo.findById(user._id)
  if (!moderator) {
    throw new Error(JSON.stringify(commonLocale.loginFailed))
  }

  if (moderator.status === config.status.inactive) {
    throw new Error(JSON.stringify(validationLocale.user.accountBlocked))
  }

  if (!method.comparePassword(body.oldPassword, user.password)) {
    throw new Error(JSON.stringify(commonLocale.loginFailed))
  }
  const resultToken = genTokenObject(moderator._id, moderator.email, moderator._v + 1)
  const updateUser = {
    lastLogin: moment().toDate(),
    password: method.hashInputPassword(body.password),
    _v: moderator._v + 1
  }

  await repo.updateOne({ email: moderator.email }, updateUser)
  delete moderator.password
  const authenData = { ...moderator.dataValues, ...updateUser, ...resultToken }
  return authenData
}

const deleteUser = async (id) => {
  const userModel = await repo.findById(id)
  if (!userModel) {
    throw new Error(JSON.stringify((commonLocale.notFound)));
  }
  return repo.destroy(id)
}

/**
 * Resend OTP without authen
 * For fotgot Password
 * @param {*} body
 * @returns
 */
const forgotPwd = async (body) => {
  const { email } = body
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

  return sendMailForgotPwd(userData, code, expiredTime)
}

/**
 * You reset password by OTP
 * @param {*} body
 */
async function resetPwd(body, accessor = {}) {
  const email = body.email.toLowerCase().trim()
  const moderator = await repo.findOne({
    email,
  })
  if (!moderator) {
    throw new Error(JSON.stringify(validationLocale.email.emailNoneRegister))
  }
  await isValidOTP(email, body.code)
  const resultToken = genTokenObject(moderator._id, moderator.email, moderator._v + 1)
  const updateUser = {
    lastLogin: moment().toDate(),
    password: method.hashInputPassword(body.password),
    _v: moderator._v + 1
  }
  await repo.updateVerifyEmailSeq(email, { isActive: false })
  await repo.updateOne({ email }, updateUser)
  delete moderator.password
  const authenData = { ...moderator.dataValues, ...updateUser, ...resultToken }
  return authenData
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

export default {
  index,
  show,
  update,
  deleteUser,
  // Auth
  signUp,
  loginByEmail,
  checkExistAccount,
  logout,
  updateProfile,
  changePwd,
  forgotPwd,
  resetPwd
}
