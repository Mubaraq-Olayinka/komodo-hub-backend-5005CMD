import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as service from '../services/canvasService';

export const createCanvas = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { title, description } = req.body;

    const data = await service.createCanvas(req.user.uid, title, description);

    res.status(201).json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getUserCanvases = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const data = await service.getUserCanvases(req.user.uid);

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};