import { Request, Response } from 'express';
import prisma from '../config/prisma';

// GET /api/v1/admin/dashboard
export const getDashboard = async (req: Request, res: Response) => {
  const [totalUsers, totalBookings, totalProviders, revenue] = await Promise.all([
    prisma.user.count(),
    prisma.booking.count(),
    prisma.provider.count(),
    prisma.booking.aggregate({ where: { status: 'COMPLETED' }, _sum: { totalAmount: true } }),
  ]);
  return res.json({
    totalUsers,
    totalBookings,
    totalProviders,
    totalRevenue: revenue._sum.totalAmount || 0,
  });
};

// GET /api/v1/admin/providers
export const getProviders = async (req: Request, res: Response) => {
  const { status } = req.query;
  const providers = await prisma.provider.findMany({
    where: status ? { verificationStatus: status as any } : {},
    include: { user: true },
    orderBy: { joinedAt: 'desc' },
  });
  return res.json(providers);
};

// PATCH /api/v1/admin/providers/:id/approve
export const approveProvider = async (req: Request, res: Response) => {
  const provider = await prisma.provider.update({
    where: { id: req.params.id },
    data: { verificationStatus: 'APPROVED' },
  });
  // TODO: Send SMS + email notification
  return res.json({ provider, message: 'Provider approved and notified' });
};

// PATCH /api/v1/admin/providers/:id/reject
export const rejectProvider = async (req: Request, res: Response) => {
  const { reason } = req.body;
  const provider = await prisma.provider.update({
    where: { id: req.params.id },
    data: { verificationStatus: 'REJECTED' },
  });
  return res.json({ provider, message: `Provider rejected. Reason: ${reason}` });
};

// PATCH /api/v1/admin/providers/:id/suspend
export const suspendProvider = async (req: Request, res: Response) => {
  await prisma.provider.update({ where: { id: req.params.id }, data: { verificationStatus: 'SUSPENDED' } });
  return res.json({ message: 'Provider suspended' });
};

// PATCH /api/v1/admin/users/:id/suspend
export const suspendUser = async (req: Request, res: Response) => {
  await prisma.user.update({ where: { id: req.params.id }, data: { isActive: false } });
  return res.json({ message: 'User suspended' });
};

// GET /api/v1/admin/bookings
export const getAllBookings = async (req: Request, res: Response) => {
  const { status, page = '1', limit = '20' } = req.query;
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
  const bookings = await prisma.booking.findMany({
    where: status ? { status: status as any } : {},
    include: { customer: true, provider: { include: { user: true } }, serviceCategory: true },
    orderBy: { createdAt: 'desc' },
    skip,
    take: parseInt(limit as string),
  });
  return res.json(bookings);
};

// POST /api/v1/admin/payouts/process
export const processPayouts = async (req: Request, res: Response) => {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const completed = await prisma.booking.findMany({
    where: { status: 'COMPLETED', paymentStatus: 'paid', completedAt: { gte: oneWeekAgo } },
    select: { providerId: true, providerPayout: true },
  });

  const payoutMap: Record<string, number> = {};
  for (const b of completed) {
    if (b.providerId) payoutMap[b.providerId] = (payoutMap[b.providerId] || 0) + b.providerPayout;
  }

  const payouts = await Promise.all(
    Object.entries(payoutMap).map(([providerId, amount]) =>
      prisma.payout.create({
        data: { providerId, amount, periodStart: oneWeekAgo, periodEnd: new Date(), status: 'PENDING' },
      }),
    ),
  );

  return res.json({ message: `${payouts.length} payouts queued`, payouts });
};

// GET /api/v1/admin/reports/revenue
export const getRevenueReport = async (req: Request, res: Response) => {
  const data = await prisma.booking.groupBy({
    by: ['createdAt'],
    where: { status: 'COMPLETED' },
    _sum: { totalAmount: true, platformFee: true, providerPayout: true },
  });
  return res.json(data);
};
