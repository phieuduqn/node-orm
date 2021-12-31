import express from 'express'
import controller from './controller'
import { adminAuthentication } from '../../middleware';

const router = express.Router()

router.post('/upload', adminAuthentication, controller.uploadImage)
router.post('/uploadDocs', adminAuthentication, controller.uploadDoc)
router.get('/:id', adminAuthentication, controller.show)

export default router
