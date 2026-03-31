import { Router } from "express";
import * as controller from "../controllers/organizationController";
import { requireRole, verifyToken } from "../middleware/auth";

const router = Router();

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.patch(
  "/:id",
  verifyToken,
  requireRole("org_admin"),
  controller.updateOrganization,
);

export default router;
