import { Router } from 'express'

import userRouters from './user.route'
import friendRouters from './friend-request.route'
import fileRouters from './file.route'
import postRouters from './post.route'
import commentRoutes from './comment.route'

const router = Router()

router.use('/users', userRouters)
router.use('/friend-requests', friendRouters)
router.use('/files', fileRouters)
router.use('/posts', postRouters)
router.use('/comments', commentRoutes)

export default router
