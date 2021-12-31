import express from 'express'
import controller from './controller'
import authentication from '../../middleware/authMiddleWare'

const router = express.Router()

router.get('/', authentication, (req, res, next) => {
  req.query.status = 1
  req.query.toId = req.user._id
  next()
}, controller.index)


router.post('/test', (req, res, next) => {
  req.query.status = 1
  next()
}, controller.sendNotification)

router.get('/:id', authentication, (req, res, next) => {
  req.query.status = 1
  next()
}, controller.show)

router.delete('/multi', authentication, controller.destroyMultiple)

router.patch('/markasread', authentication, controller.markAsRead)


export default router
