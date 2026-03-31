import { Router } from "express";
import * as controller from "../controllers/speciesController";
import { verifyToken } from "../middleware/auth";

const router = Router();

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.get("/org", verifyToken, controller.getByOrganization);

export default router;
