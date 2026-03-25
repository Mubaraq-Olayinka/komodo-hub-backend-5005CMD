import { Request, Response } from 'express';
import * as service from '../services/authService';

// STUDENT
export const signUpStudent = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, accessCode } = req.body;

    const data = await service.createStudent(
      fullName,
      email,
      password,
      accessCode
    );

    res.status(201).json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// TEACHER
export const signUpTeacher = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, inviteCode } = req.body;

    const data = await service.createTeacher(
      fullName,
      email,
      password,
      inviteCode
    );

    res.status(201).json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// ORGANIZATION
export const signUpOrganization = async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      email,
      password,
      organizationName,
      region,
      description,
    } = req.body;

    const data = await service.createOrganization(
      fullName,
      email,
      password,
      organizationName,
      region,
      description
    );

    res.status(201).json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const data = await service.loginUser(email, password);

    res.json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};