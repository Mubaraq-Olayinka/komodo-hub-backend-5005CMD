import { Router } from 'express';
import { verifyToken, requireRole } from '../middleware/auth';
import * as controller from '../controllers/submissionController';
import multer from 'multer';

const router = Router();
const upload = multer(); // memory storage

// 🎓 Student submits
router.post(
  '/',
  verifyToken,
  requireRole('student'),
  upload.single('file'), // PDF
  controller.createSubmission
);

// 👨‍🏫 Teacher views
router.get(
  '/teacher',
  verifyToken,
  requireRole('teacher'),
  controller.getTeacherSubmissions
);

router.patch(
  '/:id/grade',
  verifyToken,
  requireRole('teacher'),
  controller.gradeSubmission
);

export default router;