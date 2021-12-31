import lodash from 'lodash'
import { handleResponse } from '../../utils/handle-response'
import to from '../../utils/to'
import service from './service'
import config from './config'

async function signUp(req, res) {
  const body = lodash.pick(req.body, config.ALLOWED_CREATE_ATTRIBUTE)
  const [error, result] = await to(service.signUp(body))
  return handleResponse(error, result, req, res)
}

async function login(req, res) {
  const body = lodash.pick(req.body, config.ALLOWED_LOGIN_ATTRIBUTE)
  const [error, result] = await to(service.loginByEmail(body, req.accessor))
  return handleResponse(error, result, req, res)
}

async function show(req, res) {
  const [error, result] = await to(service.show(req.params.id))
  return handleResponse(error, result, req, res)
}

async function index(req, res) {
  const [error, result] = await to(service.index(req.query))
  return handleResponse(error, result, req, res)
}

/**
 * Verify email and return access token
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function verifyEmailOTP(req, res) {
  const [error, result] = await to(service.verifyEmailOTP(req.body, req.accessor))
  return handleResponse(error, result, req, res)
}

async function logout(req, res) {
  const [error, result] = await to(service.logout(req.body))
  return handleResponse(error, result, req, res)
}

async function verifyIdentity(req, res) {
  const body = lodash.pick(req.body, config.ALLOWED_VERIFY_IDENTITY)
  const userId = req.user._id
  const [error, result] = await to(service.verifyIdentity(userId, body, req.user))
  return handleResponse(error, result, req, res)
}

async function updateProfile(req, res) {
  const body = lodash.pick(req.body, config.ALLOWED_UPDATE_ATTRIBUTE)
  const userId = req.user._id
  const [error, result] = await to(service.updateProfile(userId, body, req.user))
  return handleResponse(error, result, req, res)
}


async function resendOTPWithOutAuthen(req, res) {
  const body = lodash.pick(req.body, config.ALLOWED_RESEND_OTP)
  const [error, result] = await to(service.resendOTPWithOutAuthen(body))
  return handleResponse(error, result, req, res)
}

async function resendOTPIncludeAuthen(req, res) {
  const body = lodash.pick(req.body, config.ALLOWED_RESEND_OTP)
  const [error, result] = await to(service.resendOTPIncludeAuthen(body, req.user))
  return handleResponse(error, result, req, res)
}

/**
 * Check OTP is valid or invalid
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function isValidOTP(req, res) {
  const [error, result] = await to(service.isValidOTP(req.body.email, req.body.code))
  return handleResponse(error, result, req, res)
}

/**
 * User reset password
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function changePwd(req, res) {
  const body = lodash.pick(req.body, ['email', 'password', 'code'])
  const [error, result] = await to(service.changePwd(body, req.accessor))
  return handleResponse(error, result, req, res)
}

const loginSocial = async (req, res) => {
  const [error, result] = await to(service.loginSocial(req.body, req.accessor))
  return handleResponse(error, result, req, res)
}


const destroyUser = async (req, res) => {
  const [error, result] = await to(service.destroyUser(req.params.id, req.user))
  return handleResponse(error, result, req, res)
}
/**
 * Get twwiter authen token
 * @param {*} req
 * @param {*} res
 * @returns
 */
const twAuthToken = async (req, res) => {
  const [error, result] = await to(service.twAuthToken())
  return handleResponse(error, result, req, res)
}


export default {
  index,
  signUp,
  login,
  show,
  logout,
  verifyEmailOTP,
  verifyIdentity,
  updateProfile,

  resendOTPWithOutAuthen,
  resendOTPIncludeAuthen,

  isValidOTP,
  changePwd,

  loginSocial,
  twAuthToken,

  destroyUser
}
