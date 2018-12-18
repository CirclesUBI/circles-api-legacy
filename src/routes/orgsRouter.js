import { Router } from 'express'
import orgsController from '../controllers/orgsController'

const router = Router()

router.get('/', orgsController.all);
router.get('/:id', orgsController.findOne);
router.post('/:id', orgsController.addOne);
router.delete('/:id', orgsController.deleteOne);

export default router
