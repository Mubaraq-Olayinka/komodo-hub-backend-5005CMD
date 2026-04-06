import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as service from '../services/sightingService';

export const create = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    const { speciesName, location, description, imageUrl } = req.body;

    const id = await service.createSighting({
      userId: req.user.uid,
      speciesName,
      location,
      description,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({ id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAll = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    const data = await service.getSightings(req.user.uid);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};