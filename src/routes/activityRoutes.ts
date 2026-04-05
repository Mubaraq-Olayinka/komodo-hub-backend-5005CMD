import { Router } from "express";
import { verifyToken, requireRole } from "../middleware/auth";
import {
  createActivity,
  getStudentActivities,
  getTeacherActivities,
} from "../controllers/activityController";

const router = Router();

// 👨‍🏫 Only teachers
router.post("/", verifyToken, requireRole("teacher"), createActivity);
router.get(
  "/teacher",
  verifyToken,
  requireRole("teacher"),
  getTeacherActivities,
);
router.get("/student", verifyToken, requireRole("student"), getStudentActivities);

export default router;
