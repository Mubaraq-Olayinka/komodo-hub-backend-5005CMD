import { Router } from 'express';
import { verifyToken, requireRole } from '../middleware/auth';
import * as controller from '../controllers/canvasController';

const router = Router();

router.post('/', verifyToken, requireRole('student'), controller.createCanvas);
router.get('/', verifyToken, requireRole('student'), controller.getUserCanvases);

export default router;