import express from 'express'
import paramValidation from '../validator'
import Ctrl from './controller'
import { adminAuthentication } from '../../middleware';
import { filter, PERMISSION, PERMISSION_MODULE } from '../../author/cms.author'

const router = express.Router();

router.get(
  '/', adminAuthentication,
  filter(PERMISSION_MODULE.role, PERMISSION.read),
  Ctrl.index
);
router.get(
  '/:id', adminAuthentication,
  filter(PERMISSION_MODULE.role, PERMISSION.read),
  Ctrl.show
);
router.post(
  '/', adminAuthentication,
  filter(PERMISSION_MODULE.role, PERMISSION.create),
  paramValidation.role.create, Ctrl.create
);
router.patch(
  '/:id', adminAuthentication,
  filter(PERMISSION_MODULE.role, PERMISSION.update),
  paramValidation.role.update, Ctrl.update
);
router.delete(
  '/:id', adminAuthentication,
  filter(PERMISSION_MODULE.role, PERMISSION.delete),
  Ctrl.destroy
);

export default router
