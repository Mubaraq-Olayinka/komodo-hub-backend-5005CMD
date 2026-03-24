import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as service from '../services/sightingService';

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const id = await service.createSighting({
      ...req.body,
      userId: req.user.uid,
      createdAt: new Date(),
    });

    res.status(201).json({ id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAll = async (_req: AuthRequest, res: Response) => {
  try {
    const data = await service.getSightings();
    res.json(data);
  } catch (error: any) {
    console.error('GET SIGHTINGS ERROR:', error);
    res.status(500).json({ error: error.message });
  }
};