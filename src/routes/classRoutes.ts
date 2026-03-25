import { Router } from 'express';
import { createClass } from '../controllers/classController';
import { requireRole, verifyToken } from '../middleware/auth';

const router = Router();

router.post('/', verifyToken, requireRole('teacher'), createClass);

export default router;