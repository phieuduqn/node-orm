import Joi from 'joi'
import errorMessage from '../../utils/custom-error-message'

module.exports = {
  create: {
    body: {
      senderEmail: Joi.string().error(errorMessage())
    }
  },
  update: {
    body: {
      senderEmail: Joi.string().error(errorMessage())
    }
  }
}
