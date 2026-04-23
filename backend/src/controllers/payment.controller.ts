import { Request, Response } from 'express';
import { AuthRequest } from '../auth/middleware';
import prisma from '../config/prisma';
import razorpay from '../config/razorpay';
import crypto from 'crypto';

// POST /api/v1/payments/create-order
export const createOrder = async (req: AuthRequest, res: Response) => {
  const { bookingId } = req.body;
  const booking = await prisma.booking.findFirst({ where: { id: bookingId, customerId: req.user!.id } });
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  const order = await razorpay.orders.create({
    amount: Math.round(booking.totalAmount * 100), // paise
    currency: 'INR',
    receipt: booking.id,
    notes: { bookingId: booking.id },
  });

  return res.json({ orderId: order.id, amount: order.amount, key: process.env.RAZORPAY_KEY_ID });
};

// POST /api/v1/payments/verify
export const verifyPayment = async (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!).update(body).digest('hex');

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ error: 'Payment verification failed' });
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { paymentStatus: 'paid', paymentMethod: 'razorpay' },
  });

  return res.json({ message: 'Payment verified successfully' });
};

// POST /api/v1/payments/subscription/create
export const createSubscription = async (req: AuthRequest, res: Response) => {
  const { planType } = req.body;
  const plans: Record<string, { price: number; services: number; planId: string }> = {
    basic_wash: { price: 299, services: 4, planId: process.env.RP_PLAN_BASIC || '' },
    pro_care: { price: 599, services: 8, planId: process.env.RP_PLAN_PRO || '' },
    fleet: { price: 1499, services: 20, planId: process.env.RP_PLAN_FLEET || '' },
  };

  const plan = plans[planType];
  if (!plan) return res.status(400).json({ error: 'Invalid plan type' });

  const subscription = await razorpay.subscriptions.create({
    plan_id: plan.planId,
    customer_notify: 1,
    quantity: 1,
    total_count: 12,
  } as any);

  await prisma.subscription.create({
    data: {
      customerId: req.user!.id,
      planType,
      price: plan.price,
      billingCycle: 'monthly',
      servicesRemaining: plan.services,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      razorpaySubscriptionId: subscription.id,
    },
  });

  return res.json({ subscriptionId: subscription.id, shortUrl: (subscription as any).short_url });
};

// GET /api/v1/payments/:bookingId/invoice
export const getInvoice = async (req: AuthRequest, res: Response) => {
  const booking = await prisma.booking.findFirst({
    where: { id: req.params.bookingId, customerId: req.user!.id },
    include: { serviceCategory: true, provider: { include: { user: true } } },
  });
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  // In production: generate PDF using pdfkit/puppeteer and stream it
  return res.json({ invoice: booking, message: 'PDF generation requires pdfkit integration' });
};
