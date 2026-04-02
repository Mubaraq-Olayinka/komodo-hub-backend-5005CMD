import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import * as service from "../services/activityService";

export const createActivity = async (req: AuthRequest, res: Response) => {
  try {
    const { classId, title, description, dueDate } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.user.organizationId) {
      return res.status(400).json({ message: "Organization missing" });
    }

    const data = await service.createActivity(
      classId,
      title,
      description,
      req.user.uid,
      req.user.organizationId,
      dueDate,
    );

    res.status(201).json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
