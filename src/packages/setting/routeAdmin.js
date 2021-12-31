import express from 'express'
import controller from './controller'
import validator from '../validator'

import { adminAuthentication } from '../../middleware';
import { filter, PERMISSION, PERMISSION_MODULE } from '../../author/cms.author'

const router = express.Router()

router.get(
  '/', adminAuthentication,
  filter(PERMISSION_MODULE.setting, PERMISSION.read),
  (req, res, next) => {
    req.params.id = 1
    next()
  }, controller.show
)

router.post(
  '/', adminAuthentication,
  filter(PERMISSION_MODULE.setting, PERMISSION.create),
  validator.setting.create, controller.create
)
router.patch(
  '/', adminAuthentication,
  filter(PERMISSION_MODULE.setting, PERMISSION.update),
  validator.setting.update, (req, res, next) => {
    req.params.id = 1
    next()
  }, controller.update
)

export default router
