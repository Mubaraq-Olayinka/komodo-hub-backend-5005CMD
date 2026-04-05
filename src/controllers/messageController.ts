import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as service from '../services/messageService';

// ✅ SEND
export const send = async (req: AuthRequest, res: Response) => {
  try {
    const { receiverEmail, message } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const data = await service.sendMessage(
      req.user.uid,
      req.user.fullName,
      req.user.email as string,
      receiverEmail,
      message
    );

    res.status(201).json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ GET MESSAGES
export const getMyMessages = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const data = await service.getUserMessages(req.user.uid);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};