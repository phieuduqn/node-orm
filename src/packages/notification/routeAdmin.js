import express from 'express'
import controller from './controller'
import validator from '../validator'

import { adminAuthentication } from '../../middleware';
import { filter, PERMISSION, PERMISSION_MODULE } from '../../author/cms.author'

const router = express.Router()

router.get(
  '/', adminAuthentication,
  filter(PERMISSION_MODULE.skill, PERMISSION.read),
  controller.index
)
router.get(
  '/:id', adminAuthentication,
  filter(PERMISSION_MODULE.skill, PERMISSION.read),
  controller.show
)

router.post(
  '/', adminAuthentication,
  filter(PERMISSION_MODULE.skill, PERMISSION.create),
  validator.skill.create, controller.create
)
router.patch(
  '/:id', adminAuthentication,
  filter(PERMISSION_MODULE.skill, PERMISSION.update),
  validator.skill.update, controller.update
)
router.delete(
  '/delMultiple', adminAuthentication,
  filter(PERMISSION_MODULE.skill, PERMISSION.delete),
  controller.destroyMultiple
)
router.delete(
  '/:id', adminAuthentication,
  filter(PERMISSION_MODULE.skill, PERMISSION.delete),
  controller.destroy
)


export default router
