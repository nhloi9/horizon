import { Router } from 'express'

import { postControllers as controller } from '../../controllers'
import { postValidation as validation } from '../../validations'
import { verifyToken } from '../../middlewares'

const router = Router()

router
  .route('/')
  .post(validation.createPost, verifyToken, controller.createPost)

router.get('/home', verifyToken, controller.getHomePosts)
router
  .route('/:id/react')
  .post(verifyToken, validation.reactPost, controller.reactPost)
  .delete(verifyToken, controller.removeReactPost)

router.route('/:id').put(verifyToken, controller.updatePost)
export default router
