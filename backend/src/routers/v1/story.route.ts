import { Router } from 'express'

import { storyControllers as controller } from '../../controllers'
// import { postValidation as validation } from '../../validations'
import { verifyToken } from '../../middlewares'

const router = Router()

router.post('/', verifyToken, controller.createStory)
export default router
