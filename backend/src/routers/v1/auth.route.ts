import { Router } from 'express'

import { authControllers as controller } from '../../controllers'

const router = Router()

router.get('/url', controller.getOauthUrl)
router.get('/callback', controller.getOauthToken)

export default router
