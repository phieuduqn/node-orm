import express from 'express'
import paramValidation from '../validator'
import Ctrl from './controller'

import { adminAuthentication } from '../../middleware';
import { filter, PERMISSION, PERMISSION_MODULE } from '../../author/cms.author'
import { rateLimitByIp } from '../../middleware/rateLimit'
import config from './config'

const moderatorRouter = express.Router();
const authRouter = express.Router();

// Auth Route
authRouter.post('/login', paramValidation.moderator.loginEmail, Ctrl.login);
authRouter.post('/logout', Ctrl.logout);
authRouter.post('/resetPwd', rateLimitByIp(config.KEY_LIMIT_CHANGE_PWD, 30, 60), paramValidation.moderator.resetPwd, Ctrl.resetPwd);
authRouter.post(
  '/forgotPwd',
  rateLimitByIp(config.KEY_LIMIT_RESEND_OTP, 30, 60),
  paramValidation.moderator.forgotPwd,
  Ctrl.forgotPwd
);

// User Route
authRouter.post(
  '/signUp', adminAuthentication,
  filter(PERMISSION_MODULE.moderator, PERMISSION.create),
  paramValidation.moderator.signUp, Ctrl.signUp
);
moderatorRouter.get(
  '/', adminAuthentication,
  filter(PERMISSION_MODULE.moderator, PERMISSION.read),
  (req, res, next) => {
    req.query.excludes = ['password']
    next()
  }, Ctrl.index
);
moderatorRouter.get(
  '/profile/:id', adminAuthentication,
  filter(PERMISSION_MODULE.moderator, PERMISSION.read),
  Ctrl.show
);
moderatorRouter.patch('/profile', adminAuthentication, paramValidation.moderator.update, Ctrl.updateProfile);
moderatorRouter.post(
  '/changePwd', adminAuthentication,
  rateLimitByIp(config.KEY_LIMIT_CHANGE_PWD, 30, 60),
  paramValidation.moderator.changePwd, Ctrl.changePwd
);

moderatorRouter.patch(
  '/:id', adminAuthentication,
  filter(PERMISSION_MODULE.moderator, PERMISSION.update),
  paramValidation.moderator.adminUpdate, Ctrl.update
);
moderatorRouter.delete(
  '/:id', adminAuthentication,
  filter(PERMISSION_MODULE.moderator, PERMISSION.delete),
  Ctrl.deleteUser
);
moderatorRouter.get('/profile', adminAuthentication, (req, res, next) => {
  req.params.id = req.user._id
  next()
}, Ctrl.show);

export {
  moderatorRouter,
  authRouter
}
