import { Router } from 'express';
import { authenticate, requireRole } from '../auth/middleware';
import { createOrder, verifyPayment, createSubscription, getInvoice } from '../controllers/payment.controller';

const router = Router();

router.post('/create-order', authenticate, createOrder);
router.post('/verify', verifyPayment);              // Razorpay webhook — no auth
router.post('/subscription/create', authenticate, createSubscription);
router.get('/:bookingId/invoice', authenticate, getInvoice);

export default router;
