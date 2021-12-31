import express from 'express'
import paramValidation from '../validator'
import Ctrl from './controller'
import authentication, { unRequireAuthentication } from '../../middleware/authMiddleWare'
import { rateLimitByIp } from '../../middleware/rateLimit'
import config from './config'

const userRouter = express.Router();
const authRouter = express.Router();

// User Route
// User Route
userRouter.get('/', unRequireAuthentication, (req, res, next) => {
  req.query.excludes = ['password']
  req.query.ignoreInactiveToken = true
  req.query.isVerifiedEmail = true
  next()
}, Ctrl.index);
userRouter.get('/profile', authentication, (req, res, next) => {
  req.params.id = req.user._id
  next()
}, Ctrl.show);

userRouter.get('/profile/:id', unRequireAuthentication, Ctrl.show);
userRouter.patch('/profile', authentication, paramValidation.user.update, Ctrl.updateProfile);
userRouter.patch('/verify/', authentication, paramValidation.user.verifyIdentity, Ctrl.verifyIdentity);

// Login Social
authRouter.post('/loginSocial', paramValidation.user.loginSocial, Ctrl.loginSocial);
authRouter.get('/twAuthToken', rateLimitByIp(config.KEY_LIMIT_GET_OAUTH_TWITTER_TOKEN, 5, 60), Ctrl.twAuthToken);

// Auth Route
authRouter.post('/signUp', paramValidation.user.signUp, Ctrl.signUp);

authRouter.post('/login', paramValidation.user.loginEmail, Ctrl.login);

authRouter.post('/verifyEmailOTP', paramValidation.user.verifyEmailOTP, Ctrl.verifyEmailOTP);

authRouter.post('/isValidOTP', rateLimitByIp(config.KEY_LIMIT_CHECK_OTP, 30, 60), paramValidation.user.verifyEmailOTP, Ctrl.isValidOTP);

authRouter.post('/changePwd', rateLimitByIp(config.KEY_LIMIT_CHANGE_PWD, 30, 60), paramValidation.user.changePwd, Ctrl.changePwd);

authRouter.post('/logout', Ctrl.logout);

authRouter.post(
  '/resendIncAuOTP', // include authentication
  rateLimitByIp(config.KEY_LIMIT_RESEND_OTP, 30, 60),
  paramValidation.user.resendEmailOTPIncAuth,
  authentication,
  Ctrl.resendOTPIncludeAuthen
);
authRouter.post(
  '/resendExcAuOTP', // exclude authentication
  rateLimitByIp(config.KEY_LIMIT_RESEND_OTP, 30, 60),
  paramValidation.user.resendEmailOTPWithoutAuth,
  Ctrl.resendOTPWithOutAuthen
);

export {
  userRouter,
  authRouter
}
