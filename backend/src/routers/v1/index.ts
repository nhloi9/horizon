import { Router } from 'express'

import userRouters from './user.route'
import authRouters from './auth.route'
import friendRouters from './friend-request.route'

const router = Router()

router.use('/users', userRouters)
router.use('/auth', authRouters)
router.use('/friend-request', friendRouters)

export default router
