import Joi from 'joi'
import errorMessage from '../../utils/custom-error-message'
import config from './config'

export default {
  create: {
    body: {
      name: Joi.string().max(150).required().error(errorMessage()),
      role: Joi.string().max(50).required().error(errorMessage()),
      status: Joi.number().valid(config.statusList).error(errorMessage())
    }
  },
  update: {
    body: {
      name: Joi.string().max(150).error(errorMessage()),
      status: Joi.number().valid(config.statusList).error(errorMessage())
    }
  }
}
