import { Router } from 'express';
import userController from '../controllers/userController';

const router = Router();

router.get('/', userController.all);
router.get('/:userId', userController.findOne);

router.put('/:userId', userController.addOne);

export default router;
