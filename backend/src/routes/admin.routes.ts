import { Router } from 'express';
import { authenticate, requireRole } from '../auth/middleware';
import {
  getDashboard, getProviders, approveProvider, rejectProvider,
  suspendProvider, suspendUser, getAllBookings, processPayouts, getRevenueReport
} from '../controllers/admin.controller';

const router = Router();
router.use(authenticate, requireRole('ADMIN'));

router.get('/dashboard', getDashboard);
router.get('/providers', getProviders);
router.patch('/providers/:id/approve', approveProvider);
router.patch('/providers/:id/reject', rejectProvider);
router.patch('/providers/:id/suspend', suspendProvider);
router.patch('/users/:id/suspend', suspendUser);
router.get('/bookings', getAllBookings);
router.post('/payouts/process', processPayouts);
router.get('/reports/revenue', getRevenueReport);

export default router;
