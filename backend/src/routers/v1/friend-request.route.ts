import { Router } from 'express'

import { friendRequestControllers as controller } from '../../controllers'
import { verifyToken } from '../../middlewares'

const router = Router()

router.post('/:receiverId', verifyToken, controller.addRequestFriend)
router.delete('/:receiverId', verifyToken, controller.cancleFriendRequest)

export default router
