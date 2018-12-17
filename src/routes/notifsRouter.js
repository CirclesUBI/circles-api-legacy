import { Router } from 'express'
import notifsController from '../controllers/notifsController'

const router = Router()

router.get('/', notifsController.all)

export default router
