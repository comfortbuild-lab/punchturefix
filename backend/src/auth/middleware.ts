import { Request, Response, NextFunction } from 'express';
import admin from '../config/firebase';
import prisma from '../config/prisma';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { id: string; firebaseUid: string; role: string };
}

// Verify Firebase token and attach user to request
export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = { id: decoded.id, firebaseUid: decoded.firebaseUid, role: decoded.role };
    return next();
  } catch {
    // Try Firebase token as fallback
    try {
      const firebaseUser = await admin.auth().verifyIdToken(token);
      const user = await prisma.user.findUnique({ where: { firebaseUid: firebaseUser.uid } });
      if (!user) return res.status(401).json({ error: 'User not found' });
      req.user = { id: user.id, firebaseUid: user.firebaseUid, role: user.role };
      return next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

export const issueJWT = (user: { id: string; firebaseUid: string; role: string }) => {
  const accessToken = jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: '15m' });
  const refreshToken = jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};
