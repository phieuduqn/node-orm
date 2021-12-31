import express from 'express'
import controller from './controller'
import authentication from '../../middleware/authMiddleWare'

const router = express.Router()

router.get('/', (req, res, next) => {
  req.query.status = 1
  next()
}, controller.index)
router.get('/:id', authentication, (req, res, next) => {
  req.query.status = 1
  next()
}, controller.show)


export default router
