/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
import { verify } from 'jsonwebtoken';
import config from '../configs';
import { commonLocale, validationLocale } from '../locales';
import { handleResponse } from '../utils/handle-response';
import to from '../utils/to';
import repoUser from '../packages/user/repository'
import userService from '../packages/user/service'
import userConfig from '../packages/user/config'


const authentication = async (req, res, next) => {
  const fullPrefixToken = req.headers.authorization;
  if (fullPrefixToken) {
    const token = fullPrefixToken.split(' ')[1]
    verify(`${token}`, config.secret, async (error, decoded) => {
      if (error) {
        return handleResponse(commonLocale.tokenVerifyFailed, null, req, res)
      }
      if (typeof decoded === 'string') {
        decoded = JSON.parse(decodeURIComponent(decoded))
      }
      if (typeof decoded.id === 'undefined') {
        return handleResponse(commonLocale.tokenVerifyFailed, null, req, res)
      }
      // TODO Cache User Data
      const [errorUser, user] = await to(repoUser.findById(decoded.id, true))
      if (!user) {
        return handleResponse(commonLocale.authenticationInfoNotFound, null, req, res)
      }

      if (user.isDeleted) {
        return handleResponse(commonLocale.authenticationInfoNotFound, null, req, res)
      }
      const { isBlocked, errorBlocked } = userService.validateBlockedUser(user)
      if (isBlocked) {
        return handleResponse(errorBlocked, null, req, res)
      }

      if (decoded._v < user._v) {
        return handleResponse(commonLocale.tokenVerifyFailed, null, req, res)
      }

      req.user = user.get({ plain: true });
      next()
    })
  } else {
    return handleResponse(commonLocale.noToken, null, req, res)
  }
};

/**
 * Accepted both login and not login
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const unRequireAuthentication = async (req, res, next) => {
  const fullPrefixToken = req.headers.authorization;
  if (fullPrefixToken) {
    const token = fullPrefixToken.split(' ')[1]
    const invalids = [null, 'null', undefined, 'undefined']
    if (!token || invalids.includes(token)) {
      return next()
    }
    verify(`${token}`, config.secret, async (error, decoded) => {
      if (error) {
        return handleResponse(commonLocale.tokenVerifyFailed, null, req, res)
      }
      if (typeof decoded === 'string') {
        decoded = JSON.parse(decodeURIComponent(decoded))
      }
      if (typeof decoded.id === 'undefined') {
        return handleResponse(commonLocale.tokenVerifyFailed, null, req, res)
      }
      // TODO Cache User Data
      const [errorUser, user] = await to(repoUser.findById(decoded.id, true))
      if (!user) {
        return handleResponse(commonLocale.authenticationInfoNotFound, null, req, res)
      }
      if (user.status === userConfig.status.inactive || decoded._v < user._v) {
        return handleResponse(commonLocale.tokenVerifyFailed, null, req, res)
      }
      req.user = user.get({ plain: true });
      next()
    })
  } else {
    next()
  }
};


export default authentication
