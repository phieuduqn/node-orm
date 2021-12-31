import Joi from 'joi'
import errorMessage from '../../utils/custom-error-message'

module.exports = {
  create: {
    body: {
      name: Joi.string().required().error(errorMessage()),
      featureIds: Joi.array().allow([null, []]).error(errorMessage()),
    }
  },
  update: {
    body: {
      name: Joi.string().error(errorMessage()),
      status: Joi.number().allow([1, 0]).error(errorMessage()),
      featureIds: Joi.array().allow([null, []]).error(errorMessage()),
    }
  }
}
