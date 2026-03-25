import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as service from '../services/classService';

export const createClass = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    const teacherId = req.user.uid;
    const organizationId = req.user.organizationId;

    if (!organizationId) {
      return res.status(400).json({ message: 'Organization ID missing for user' });
    }

    const data = await service.createClass(name, teacherId, organizationId);

    res.status(201).json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};