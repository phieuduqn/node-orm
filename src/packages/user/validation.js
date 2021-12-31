import Joi from 'joi'
import configs from '../../configs'
import config from './config'
import errorMessage from '../../utils/custom-error-message'

export default {
  signUp: {
    body: {
      password: Joi.string().required().error(errorMessage()),
      email: Joi.string().regex(configs.regex.email).required().error(errorMessage()),
      fullName: Joi.string().required().error(errorMessage()),
    }
  },
  loginSocial: {
    body: {
      type: Joi.string().valid(config.accountTypeList).required().error(errorMessage()),
      token: Joi.string().required().error(errorMessage()),
      oauth_verifier: Joi.when('type', {
        is: config.accountType.twitter,
        then: Joi.string().required().error(errorMessage()),
      })
    }
  },
  loginEmail: {
    body: {
      email: Joi.string().regex(configs.regex.email).required().error(errorMessage()),
      password: Joi.string().required().error(errorMessage())
    }
  },
  update: {
    body: {
      avatar: Joi.string().allow([null, '']).error(errorMessage()),
      gender: Joi.string().valid(config.genderList).error(errorMessage()),
      fullName: Joi.string().max(100).error(errorMessage()),
      birthDay: Joi.string().error(errorMessage()),
      countryId: Joi.number().error(errorMessage()),
      age: Joi.number().error(errorMessage())
    }
  },
  logout: {
    body: {
      email: Joi.string().regex(configs.regex.email).required().error(errorMessage()),
      accessToken: Joi.string().allow([null, '']).error(errorMessage())
    }
  },
  forgotPwd: {
    body: {
      email: Joi.string().regex(configs.regex.email).required().error(errorMessage()),
    }
  },
  resetPwd: {
    body: {
      email: Joi.string().regex(configs.regex.email).required().error(errorMessage()),
      code: Joi.number().required().error(errorMessage()),
      password: Joi.string().required().error(errorMessage())
    }
  },
  checkExisted: {
    body: {
      email: Joi.string().regex(configs.regex.email).required().error(errorMessage())
    }
  },
  verifyEmailOTP: {
    body: {
      email: Joi.string().trim().regex(configs.regex.email).required().error(errorMessage()),
      code: Joi.number().error(errorMessage())
    }
  },
  resendEmailOTPWithoutAuth: {
    body: {
      email: Joi.string().trim().regex(configs.regex.email).required().error(errorMessage()),
      type: Joi.string().valid(config.otpTypeList).required().error(errorMessage())
    }
  },
  resendEmailOTPIncAuth: {
    body: {
      type: Joi.string().valid(config.otpTypeList).required().error(errorMessage())
    }
  },
  changePwd: {
    email: Joi.string().trim().regex(configs.regex.email).required().error(errorMessage()),
    code: Joi.number().required().error(errorMessage()),
    password: Joi.string().trim().required().error(errorMessage()),
  },
  verifyIdentity: {
    body: {
      step: Joi.number().valid([1, 2]).required(),
      identityImageWithOtp: Joi.when('step', {
        is: 2,
        then: Joi.string().required(),
      }),
      identityBefore: Joi.when('step', {
        is: 1,
        then: Joi.string().required(),
      }),
      identityAfter: Joi.when('step', {
        is: 1,
        then: Joi.string().required(),
      })
    }
  }
}
