import { Router } from "express";
import { verifyToken, requireRole } from "../middleware/auth";
import {
  createActivity,
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

export default router;
