import { Router } from 'express'
import authenticator from '../packages/system/authenticator'
import { userRouter, authRouter } from '../packages/user/route'
import mediaRoute from '../packages/media/route'
import countryRoute from '../packages/country/route'
import settingRoute from '../packages/setting/route'
import notificationRoute from '../packages/notification/route'

const api = Router();

api.use('*', authenticator)
api.use('/auth', authRouter)
api.use('/user', userRouter)
api.use('/media', mediaRoute)
api.use('/country', countryRoute)
api.use('/cfg', settingRoute)
api.use('/notification', notificationRoute)


export default api
