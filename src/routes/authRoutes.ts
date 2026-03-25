import { Router } from 'express';
import {
  signUpStudent,
  signUpTeacher,
  signUpOrganization,
} from '../controllers/authController';
import { login } from '../controllers/authController';

const router = Router();

router.post('/signup/student', signUpStudent);
router.post('/signup/teacher', signUpTeacher);
router.post('/signup/organization', signUpOrganization);
router.post('/login', login);

export default router;