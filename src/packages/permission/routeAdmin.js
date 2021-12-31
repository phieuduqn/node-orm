import express from 'express'
// import paramValidation from '../validator'
import Ctrl from './controller'
import { adminAuthentication } from '../../middleware';

const router = express.Router();

router.get('/', adminAuthentication, (req, res, next) => {
  req.query.status = 1
  req.query.includes = ['_id', 'name', 'code', 'modulePrefix', 'status']
  next()
}, Ctrl.index);
router.get('/:id', adminAuthentication, Ctrl.show);
router.delete('/:id', adminAuthentication, Ctrl.destroy);

export default router
