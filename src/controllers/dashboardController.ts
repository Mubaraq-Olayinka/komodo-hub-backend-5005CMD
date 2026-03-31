import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as service from '../services/dashboardService';

export const getDashboard = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const data = await service.getDashboardStats(req.user);

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};