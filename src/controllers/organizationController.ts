import { Request, Response } from "express";
import * as service from "../services/organizationService";

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
