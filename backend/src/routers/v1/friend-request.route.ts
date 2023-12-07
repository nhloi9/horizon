import { Router } from 'express'

import { friendRequestControllers as controller } from '../../controllers'
import { verifyToken } from '../../middlewares'

const router = Router()
router.use(verifyToken)

router.get('/friends', controller.getAllFriends)
router.get('/receive', controller.getReceiveRequests)
router.get('/send', controller.getSendRequests)

router
  .route('/:other')
  .post(verifyToken, controller.addRequestFriend)
  .delete(verifyToken, controller.cancelFriendRequest)
  .put(verifyToken, controller.acceptFriendRequest)

export default router
