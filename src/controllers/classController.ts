import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as service from '../services/classService';

// ✅ CREATE
export const createClass = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!req.user.organizationId) {
      return res
        .status(400)
        .json({ message: 'Organization ID missing for user' });
    }

    const data = await service.createClass(
      name,
      description,
      req.user.uid,
      req.user.organizationId
    );

    res.status(201).json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ GET ALL
export const getClasses = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.organizationId) {
      return res.status(400).json({ message: 'Missing organization' });
    }

    const data = await service.getClasses(req.user.organizationId);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ DELETE
export const deleteClass = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;

    const result = await service.deleteClass(id as string, req.user.uid);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ GET MY CLASSES (STUDENT)
export const getMyClasses = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const classIds = req.user.classIds || [];

    const data = await service.getStudentClasses(classIds);

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTeacherClasses = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const data = await service.getClassesByTeacher(req.user.uid);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllClasses = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.organizationId) {
      return res.status(400).json({ message: 'Organization missing' });
    }
    const data = await service.getAllClasses(req.user.organizationId);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};