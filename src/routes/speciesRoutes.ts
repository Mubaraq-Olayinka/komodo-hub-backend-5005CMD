import { Router } from "express";
import * as controller from "../controllers/speciesController";
import { requireRole, verifyToken } from "../middleware/auth";

const router = Router();

router.get("/", controller.getAll);
router.get("/org", verifyToken, controller.getByOrganization);
router.get("/:id", controller.getById);
router.post("/", verifyToken, requireRole('teacher'), controller.create);

export default router;
