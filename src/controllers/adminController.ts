import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as service from '../services/adminService';

// GET all teachers
export const getTeachers = async (_req: AuthRequest, res: Response) => {
  try {
    const data = await service.getAllTeachers();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Suspend teacher
export const suspendTeacher = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await service.suspendTeacher(id as string);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Activate teacher
export const activateTeacher = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await service.activateTeacher(id as string);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};