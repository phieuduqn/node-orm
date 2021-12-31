import { Router } from 'express'
import authenticator from '../packages/system/authenticator'
import { moderatorRouter, authRouter } from '../packages/moderator/routeAdmin'
import settingRoute from '../packages/setting/routeAdmin'
import roleRouter from '../packages/role/routeAdmin'
import permissionRouter from '../packages/permission/routeAdmin'
import userRouter from '../packages/user/routeAdmin'
import mediaRouter from '../packages/media/routeAdmin'

const api = Router();

api.use('*', authenticator)
api.use('/auth', authRouter)
api.use('/moderator', moderatorRouter)
api.use('/setting', settingRoute)
api.use('/role', roleRouter)
api.use('/permission', permissionRouter)
api.use('/user', userRouter)
api.use('/media', mediaRouter)

export default api
