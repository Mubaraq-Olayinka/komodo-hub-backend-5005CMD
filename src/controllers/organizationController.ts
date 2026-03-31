import { Request, Response } from "express";
import * as service from "../services/organizationService";
import { AuthRequest } from '../middleware/auth';

export const getAll = async (_req: Request, res: Response) => {
  try {
    const data = await service.getAllOrganizations();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const data = await service.getOrganizationById(id);

    if (!data) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOrganization = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // 🔐 Ensure user belongs to this org
    if (req.user.organizationId !== id) {
      return res
        .status(403)
        .json({ message: 'Forbidden: Not your organization' });
    }

    const data = await service.updateOrganization(id, req.body);

    res.json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};