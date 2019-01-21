import { Router } from 'express'
import offersController from '../controllers/offersController'

const router = Router()

router.get('/', offersController.all);
router.get('/:id', offersController.findOne);
router.post('/:id', offersController.addOne);
router.delete('/:id', offersController.deleteOne);

export default router
