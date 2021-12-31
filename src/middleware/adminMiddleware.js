/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
import { verify } from 'jsonwebtoken';
import config from '../configs';
import { commonLocale } from '../locales';
import { handleResponse } from '../utils/handle-response';
import to from '../utils/to';
import repoModerator from '../packages/moderator/repository'
import moderatorConfig from '../packages/moderator/config'


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
      const [errorUser, user] = await to(repoModerator.findById(decoded.id, true))
      if (!user) {
        return handleResponse(commonLocale.authenticationInfoNotFound, null, req, res)
      }
      if (user.status === moderatorConfig.status.inactive || decoded._v < user._v) {
        return handleResponse(commonLocale.tokenVerifyFailed, null, req, res)
      }
      req.user = user.get({ plain: true });
      next()
    })
  } else {
    return handleResponse(commonLocale.noToken, null, req, res)
  }
};

export default authentication
