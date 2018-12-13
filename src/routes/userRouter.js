import { Router } from 'express';
import userController from '../controllers/userController';

const router = Router();

router.get('/all', userController.all);
router.get('/:id', userController.findOne);
router.post('/:id', userController.addOne);
router.post('/update/:id', userController.updateOne);
router.post('/delete/:id', userController.deleteOne);

export default router;
