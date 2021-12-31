import express from 'express'
import Ctrl from './controller'
import { adminAuthentication } from '../../middleware';
import { filter, PERMISSION, PERMISSION_MODULE } from '../../author/cms.author'

const router = express.Router();

router.get(
  '/', adminAuthentication,
  filter(PERMISSION_MODULE.user, PERMISSION.read),
  (req, res, next) => {
    req.query.excludes = ['password']
    // req.query.isDeleted = 'nofilter'
    req.query.isBlocked = 'nofilter'
    next()
  },
  Ctrl.index
);
router.get(
  '/:id', adminAuthentication,
  filter(PERMISSION_MODULE.user, PERMISSION.read),
  Ctrl.show
);

router.delete(
  '/:id', adminAuthentication,
  filter(PERMISSION_MODULE.user, PERMISSION.delete),
  Ctrl.destroyUser
);


export default router
