import { Router, Response } from 'express';
import {
  signUpStudent,
  signUpTeacher,
  signUpOrganization,
} from '../controllers/authController';
import { login } from '../controllers/authController';
import { AuthRequest, verifyToken } from '../middleware/auth';

const router = Router();

router.post('/signup/student', signUpStudent);
router.post('/signup/teacher', signUpTeacher);
router.post('/signup/organization', signUpOrganization);
router.post('/login', login);
router.get("/verify", verifyToken, (req: AuthRequest, res: Response) => {
  res.json(req.user);
});

export default router;