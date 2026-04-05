import { Router } from 'express';
import * as controller from '../controllers/messageController';
import { verifyToken } from '../middleware/auth';

const router = Router();

// send message
router.post('/', verifyToken, controller.send);

// get my messages
router.get('/', verifyToken, controller.getMyMessages);

export default router;