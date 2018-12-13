import { Router } from 'express';
import userController from '../controllers/userController';

const router = Router();

router.get('/', userController.all);
router.get('/:userId', userController.findOne);
 
export default router;
