import { Router } from 'express';
import usersController from '../controllers/usersController';

const router = Router();

router.get('/', usersController.all);
router.get('/:id', usersController.findOne);
router.post('/:id', usersController.addOne);
router.delete('/:id', usersController.deleteOne);
router.post('/createToken', usersController.createToken);

export default router;
