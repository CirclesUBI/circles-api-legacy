import { Router } from 'express'
import orgsController from '../controllers/orgsController'

const router = Router()

router.get('/', orgsController.all)
router.get('/:id', orgsController.findOne)
router.post('/:id', orgsController.addOne)
router.post('/update/:id', orgsController.updateOne)
router.post('/delete/:id', orgsController.deleteOne)

export default router
