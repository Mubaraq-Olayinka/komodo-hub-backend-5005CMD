import { Router } from 'express';
import { verifyToken, requireRole } from '../middleware/auth';
import { createActivity } from '../controllers/activityController';

const router = Router();

// 👨‍🏫 Only teachers
router.post('/', verifyToken, requireRole('teacher'), createActivity);

export default router;