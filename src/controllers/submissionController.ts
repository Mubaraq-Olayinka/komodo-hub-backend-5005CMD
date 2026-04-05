import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as service from '../services/submissionService';

// ================= CREATE =================
export const createSubmission = async (req: AuthRequest, res: Response) => {
  try {
    const { activityId, content } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const data = await service.createSubmission(
      activityId,
      req.user.uid,
      content,
      req.file // multer file
    );

    res.status(201).json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// ================= TEACHER VIEW =================
export const getTeacherSubmissions = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const data = await service.getTeacherSubmissions(req.user.uid);

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const gradeSubmission = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { grade, feedback } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const result = await service.gradeSubmission(
      id as string,
      req.user.uid,
      grade,
      feedback
    );

    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getStudentSubmissions = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const data = await service.getStudentSubmissions(req.user.uid);

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};