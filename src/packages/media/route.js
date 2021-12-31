import express from 'express'
import MediaController from './controller'
import authentication from '../../middleware/authMiddleWare'

const router = express.Router()

router.post('/upload', authentication, MediaController.uploadImage)
router.post('/uploadDocs', authentication, MediaController.uploadDoc)
router.get('/:id', authentication, MediaController.show)


export default router
