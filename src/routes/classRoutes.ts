import { Router } from 'express';
import {
  createClass,
  getClasses,
  deleteClass,
  getMyClasses,
  getTeacherClasses,
  getAllClasses,
} from '../controllers/classController';
import { requireRole, verifyToken } from '../middleware/auth';

const router = Router();

// ✅ Teacher creates class
router.post('/', verifyToken, requireRole('teacher'), createClass);

// ✅ Teacher + Admin can view classes
router.get(
  '/',
  verifyToken,
  requireRole('org_admin'), // OR extend to org_admin later
  getClasses
);

router.get('/', verifyToken, requireRole('teacher'), getTeacherClasses);

router.get(
  '/my',
  verifyToken,
  requireRole('student'),
  getMyClasses
);

router.get(
  '/all',
  verifyToken,
  requireRole('org_admin'),
  getAllClasses
);

// ✅ Teacher deletes own class
router.delete('/:id', verifyToken, requireRole('teacher'), deleteClass);

export default router;