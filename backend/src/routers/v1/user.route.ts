import { Router } from 'express'

import { userControllers as controller } from '../../controllers'
import { userValidation as validation } from '../../validations'
import { verifyToken } from '../../middlewares'

const router = Router()

router
  .route('/register')
  .post(validation.registerUser, controller.registerUser)
  .get(verifyToken, validation.getUser, controller.getUser)

router.get('/active-acount/:ciphertext', controller.activeAcount)
router.get('/', verifyToken, controller.getUser)
router.post('/login', controller.login)

export default router
