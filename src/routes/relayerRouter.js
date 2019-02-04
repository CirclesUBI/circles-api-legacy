import { Router } from 'express';
import relayerController from '../controllers/relayerController';

const router = Router();

router.post('/signup', relayerController.signup);

export default router;
