import { pick } from 'lodash'
import { handleResponse } from '../../utils/handle-response'
import to from '../../utils/to'
import service from './service'
import config from './config'

async function signUp(req, res) {
  const body = pick(req.body, config.ALLOWED_CREATE_ATTRIBUTE)
  body.createdById = req.user._id
  const [error, result] = await to(service.signUp(body))
  return handleResponse(error, result, req, res)
}

async function login(req, res) {
  const body = pick(req.body, config.ALLOWED_LOGIN_ATTRIBUTE)
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

const update = async (req, res) => {
  const body = pick(req.body, config.ALLOWED_ADMIN_UPDATE_ATTRIBUTE)
  body.updatedById = req.user._id
  const [error, data] = await to(service.update(req.params.id, body, req.user))
  handleResponse(error, data, req, res)
}

async function logout(req, res) {
  const [error, result] = await to(service.logout(req.body))
  return handleResponse(error, result, req, res)
}

async function updateProfile(req, res) {
  const body = pick(req.body, config.ALLOWED_UPDATE_ATTRIBUTE)
  const userId = req.user._id
  const [error, result] = await to(service.updateProfile(userId, body, req.user))
  return handleResponse(error, result, req, res)
}

async function changePwd(req, res) {
  const body = pick(req.body, config.ALLOWED_UPDATE_PASSWORD_ATTRIBUTE)
  const [error, result] = await to(service.changePwd(body, req.user))
  return handleResponse(error, result, req, res)
}

const deleteUser = async (req, res) => {
  const [error, data] = await to(service.deleteUser(req.params.id))
  handleResponse(error, data, req, res)
}

async function forgotPwd(req, res) {
  const body = pick(req.body, config.ALLOWED_RESEND_OTP)
  const [error, result] = await to(service.forgotPwd(body))
  return handleResponse(error, result, req, res)
}

/**
 * Moderator reset password
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function resetPwd(req, res) {
  const body = pick(req.body, config.ALLOW_RESET_PASSWORD)
  const [error, result] = await to(service.resetPwd(body, req.accessor))
  return handleResponse(error, result, req, res)
}

export default {
  index,
  signUp,
  login,
  show,
  update,
  logout,
  updateProfile,
  changePwd,
  deleteUser,
  forgotPwd,
  resetPwd
}
