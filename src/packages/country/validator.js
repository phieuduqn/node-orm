import { body } from 'express-validator';
import validatorResult from '../../utils/handler-validator-result'
import { mediasObjectType } from './config';

module.exports = {
  validatorUploadMedia: [
    body('type')
      .isLength({ min: 1 }).withMessage('Media type is required')
      .isIn(mediasObjectType).withMessage('Invalid role media type'),
    async (req, res, next) => { if (await validatorResult(req, res)) { next() } }
  ]
}
