import { Request, Response } from 'express';
import admin from '../config/firebase';
import prisma from '../config/prisma';
import { issueJWT } from '../auth/middleware';

// POST /api/v1/auth/google
export const googleAuth = async (req: Request, res: Response) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ error: 'idToken required' });

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    let user = await prisma.user.findUnique({ where: { firebaseUid: decoded.uid } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          firebaseUid: decoded.uid,
          name: decoded.name || null,
          email: decoded.email || null,
          avatarUrl: decoded.picture || null,
          role: 'CUSTOMER',
          isVerified: decoded.email_verified ?? false,
        },
      });
    }

    const tokens = issueJWT({ id: user.id, firebaseUid: user.firebaseUid, role: user.role });
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    return res.json({ accessToken: tokens.accessToken, user });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid Google token' });
  }
};

// POST /api/v1/auth/phone/send-otp
export const sendOtp = async (req: Request, res: Response) => {
  // OTP sending is handled client-side via Firebase SDK.
  // This endpoint validates the phone format and registers intent.
  const { phone } = req.body;
  if (!phone || !/^\+91[6-9]\d{9}$/.test(phone)) {
    return res.status(400).json({ error: 'Valid Indian phone number required (+91XXXXXXXXXX)' });
  }
  return res.json({ message: 'Please complete OTP verification client-side via Firebase SDK' });
};

// POST /api/v1/auth/phone/verify
export const verifyOtp = async (req: Request, res: Response) => {
  const { idToken, phone } = req.body;
  if (!idToken) return res.status(400).json({ error: 'idToken required' });

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    let user = await prisma.user.findUnique({ where: { firebaseUid: decoded.uid } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          firebaseUid: decoded.uid,
          phone: phone || decoded.phone_number || null,
          role: 'CUSTOMER',
        },
      });
    }

    const tokens = issueJWT({ id: user.id, firebaseUid: user.firebaseUid, role: user.role });
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    const isNewUser = !user.name;
    return res.json({ accessToken: tokens.accessToken, user, isNewUser });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid OTP token' });
  }
};

// POST /api/v1/auth/refresh
export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ error: 'No refresh token' });

  try {
    const jwt = await import('jsonwebtoken');
    const decoded = jwt.default.verify(token, process.env.JWT_SECRET!) as any;
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(401).json({ error: 'User not found' });

    const tokens = issueJWT({ id: user.id, firebaseUid: user.firebaseUid, role: user.role });
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    return res.json({ accessToken: tokens.accessToken });
  } catch {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
};

// POST /api/v1/auth/logout
export const logout = async (req: Request, res: Response) => {
  res.clearCookie('refreshToken');
  return res.json({ message: 'Logged out successfully' });
};

// GET /api/v1/auth/me
export const getMe = async (req: any, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { vehicles: true, provider: true },
  });
  return res.json(user);
};
