import Joi from 'joi'
import configs from '../../configs'
import config from './config'
import errorMessage from '../../utils/custom-error-message'

export default {
  signUp: {
    body: {
      email: Joi.string().regex(configs.regex.email).required().error(errorMessage()),
      fullName: Joi.string().required().error(errorMessage()),
      password: Joi.string().required().error(errorMessage()),
      roleId: Joi.number().error(errorMessage()),
      status: Joi.number().valid([1, 0]).error(errorMessage()),
      allowSystemMessage: Joi.boolean().error(errorMessage()),
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
      fullName: Joi.string().error(errorMessage()),
      birthDay: Joi.string().error(errorMessage()),
    }
  },
  adminUpdate: {
    body: {
      roleId: Joi.number().error(errorMessage()),
      status: Joi.number().valid([1, 0]).error(errorMessage()),
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
  changePwd: {
    oldPassword: Joi.number().required().error(errorMessage()),
    password: Joi.string().trim().required().error(errorMessage()),
  },
}
