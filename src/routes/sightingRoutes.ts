import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import * as controller from '../controllers/sightingController';

const router = Router();

router.post('/', verifyToken, controller.create);
router.get('/', verifyToken, controller.getAll);

export default router;