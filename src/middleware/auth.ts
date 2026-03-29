import { Request, Response, NextFunction } from 'express';
import { auth, db } from '../config/firebase';

// Define your user type
export interface FirebaseUser {
  uid: string;
  email?: string;
  role?: 'student' | 'teacher' | 'admin';
  organizationId?: string;
  [key: string]: any; // For any extra fields
}

export interface AuthRequest extends Request {
  user?: FirebaseUser;
}

/**
 * Auth middleware to verify Firebase ID token
 * and attach user info to request
 */
export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    // Check for Authorization header
    if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    // Verify Firebase token
    const decodedToken = await auth.verifyIdToken(token);

    // Fetch user details from Firestore
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found in database' });
    }

    // Attach user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      ...userDoc.data(),
    } as FirebaseUser;

    if (req.user.status === 'suspended') {
      return res.status(403).json({ message: 'Account suspended' });
    }

    next(); // User verified, proceed
  } catch (error: any) {
    console.error('Auth Middleware Error:', error.message);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

/**
 * Optional: Role-based access middleware
 * Usage: requireRole('teacher')
 */
export const requireRole = (role: 'student' | 'teacher' | 'org_admin') => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: No user info' });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ message: `Forbidden: Requires ${role} role` });
    }

    next();
  };
};