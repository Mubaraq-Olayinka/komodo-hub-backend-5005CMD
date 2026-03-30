import express from 'express';
import * as controller from '../controllers/adminController';
import { verifyToken, requireRole } from '../middleware/auth';

const router = express.Router();

// Only admin can access
router.get(
  '/teachers',
  verifyToken,
  requireRole('org_admin'),
  controller.getTeachers
);

router.patch(
  '/teachers/:id/suspend',
  verifyToken,
  requireRole('org_admin'),
  controller.suspendTeacher
);

router.patch(
  '/teachers/:id/activate',
  verifyToken,
  requireRole('org_admin'),
  controller.activateTeacher
);

export default router;