import { Router } from 'express';
import { googleAuth, sendOtp, verifyOtp, refreshToken, logout, getMe } from '../controllers/auth.controller';
import { authenticate } from '../auth/middleware';

const router = Router();

router.post('/google', googleAuth);
router.post('/phone/send-otp', sendOtp);
router.post('/phone/verify', verifyOtp);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);

export default router;
