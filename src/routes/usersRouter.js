import { Router } from 'express';
import usersController from '../controllers/usersController';

const router = Router();

router.get('/', usersController.all);
router.get('/:id', usersController.findOne);
router.post('/:id', usersController.addOne);
router.post('/update/:id', usersController.updateOne);
router.post('/delete/:id', usersController.deleteOne);

export default router;
