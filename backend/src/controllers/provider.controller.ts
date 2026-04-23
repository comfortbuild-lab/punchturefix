import { Response } from 'express';
import { AuthRequest } from '../auth/middleware';
import prisma from '../config/prisma';

// POST /api/v1/provider/register
export const registerProvider = async (req: AuthRequest, res: Response) => {
  const { businessName, gstNumber, bio, serviceRadiusKm } = req.body;
  if (!businessName) return res.status(400).json({ error: 'businessName is required' });

  const existing = await prisma.provider.findUnique({ where: { userId: req.user!.id } });
  if (existing) return res.status(409).json({ error: 'Provider profile already exists' });

  const provider = await prisma.provider.create({
    data: { userId: req.user!.id, businessName, gstNumber, bio, serviceRadiusKm: serviceRadiusKm ?? 10 },
  });
  await prisma.user.update({ where: { id: req.user!.id }, data: { role: 'PROVIDER' } });
  return res.status(201).json({ provider, message: 'Provider registered. Pending admin approval.' });
};

// GET /api/v1/provider/dashboard
export const getDashboard = async (req: AuthRequest, res: Response) => {
  const provider = await prisma.provider.findUnique({ where: { userId: req.user!.id } });
  if (!provider) return res.status(404).json({ error: 'Provider not found' });

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const [todayJobs, totalEarnings, pendingJobs] = await Promise.all([
    prisma.booking.count({ where: { providerId: provider.id, createdAt: { gte: today } } }),
    prisma.booking.aggregate({ where: { providerId: provider.id, status: 'COMPLETED' }, _sum: { providerPayout: true } }),
    prisma.booking.count({ where: { providerId: provider.id, status: 'PENDING' } }),
  ]);

  return res.json({
    provider,
    stats: {
      todayJobs,
      totalEarnings: totalEarnings._sum.providerPayout || 0,
      pendingJobs,
      avgRating: provider.avgRating,
      totalJobs: provider.totalJobs,
    },
  });
};

// PATCH /api/v1/provider/availability
export const toggleAvailability = async (req: AuthRequest, res: Response) => {
  const provider = await prisma.provider.findUnique({ where: { userId: req.user!.id } });
  if (!provider) return res.status(404).json({ error: 'Provider not found' });
  const updated = await prisma.provider.update({ where: { id: provider.id }, data: { isAvailable: !provider.isAvailable } });
  return res.json({ isAvailable: updated.isAvailable });
};

// POST /api/v1/provider/services
export const addService = async (req: AuthRequest, res: Response) => {
  const { categoryId, serviceName, description, basePrice, unit } = req.body;
  const provider = await prisma.provider.findUnique({ where: { userId: req.user!.id } });
  if (!provider) return res.status(404).json({ error: 'Provider not found' });
  if (provider.verificationStatus !== 'APPROVED') {
    return res.status(403).json({ error: 'Account not yet approved by admin' });
  }
  const category = await prisma.serviceCategory.findUnique({ where: { id: categoryId } });
  if (!category) return res.status(404).json({ error: 'Category not found' });
  if (basePrice < category.basePriceMin || basePrice > category.basePriceMax) {
    return res.status(400).json({ error: `Price must be between ₹${category.basePriceMin} and ₹${category.basePriceMax}` });
  }
  const activeCount = await prisma.providerService.count({ where: { providerId: provider.id, isActive: true } });
  if (activeCount >= 20) return res.status(400).json({ error: 'Maximum 20 active services allowed' });

  const service = await prisma.providerService.create({
    data: { providerId: provider.id, categoryId, serviceName, description, basePrice, unit: unit ?? 'per_job' },
  });
  return res.status(201).json(service);
};

// GET /api/v1/provider/services
export const getServices = async (req: AuthRequest, res: Response) => {
  const provider = await prisma.provider.findUnique({ where: { userId: req.user!.id } });
  if (!provider) return res.status(404).json({ error: 'Provider not found' });
  const services = await prisma.providerService.findMany({ where: { providerId: provider.id }, include: { category: true } });
  return res.json(services);
};

// PUT /api/v1/provider/services/:id
export const updateService = async (req: AuthRequest, res: Response) => {
  const provider = await prisma.provider.findUnique({ where: { userId: req.user!.id } });
  if (!provider) return res.status(404).json({ error: 'Provider not found' });
  const svc = await prisma.providerService.findFirst({ where: { id: req.params.id, providerId: provider.id } });
  if (!svc) return res.status(404).json({ error: 'Service not found' });
  const updated = await prisma.providerService.update({ where: { id: svc.id }, data: req.body });
  return res.json(updated);
};

// DELETE /api/v1/provider/services/:id
export const deleteService = async (req: AuthRequest, res: Response) => {
  const provider = await prisma.provider.findUnique({ where: { userId: req.user!.id } });
  if (!provider) return res.status(404).json({ error: 'Provider not found' });
  const svc = await prisma.providerService.findFirst({ where: { id: req.params.id, providerId: provider.id } });
  if (!svc) return res.status(404).json({ error: 'Service not found' });
  await prisma.providerService.delete({ where: { id: svc.id } });
  return res.json({ message: 'Service deleted' });
};

// GET /api/v1/provider/jobs
export const getJobs = async (req: AuthRequest, res: Response) => {
  const provider = await prisma.provider.findUnique({ where: { userId: req.user!.id } });
  if (!provider) return res.status(404).json({ error: 'Provider not found' });
  const { status } = req.query;
  const jobs = await prisma.booking.findMany({
    where: { providerId: provider.id, ...(status ? { status: status as any } : {}) },
    include: { customer: true, vehicle: true, serviceCategory: true },
    orderBy: { createdAt: 'desc' },
  });
  return res.json(jobs);
};

// PATCH /api/v1/provider/jobs/:id/accept
export const acceptJob = async (req: AuthRequest, res: Response) => {
  const provider = await prisma.provider.findUnique({ where: { userId: req.user!.id } });
  if (!provider) return res.status(404).json({ error: 'Provider not found' });
  const booking = await prisma.booking.findFirst({ where: { id: req.params.id, providerId: provider.id, status: 'PENDING' } });
  if (!booking) return res.status(404).json({ error: 'Booking not found or already handled' });
  const updated = await prisma.booking.update({ where: { id: booking.id }, data: { status: 'ASSIGNED' } });
  return res.json(updated);
};

// PATCH /api/v1/provider/jobs/:id/complete
export const completeJob = async (req: AuthRequest, res: Response) => {
  const provider = await prisma.provider.findUnique({ where: { userId: req.user!.id } });
  if (!provider) return res.status(404).json({ error: 'Provider not found' });
  const booking = await prisma.booking.findFirst({ where: { id: req.params.id, providerId: provider.id, status: 'IN_PROGRESS' } });
  if (!booking) return res.status(404).json({ error: 'Active booking not found' });
  const [updated] = await Promise.all([
    prisma.booking.update({ where: { id: booking.id }, data: { status: 'COMPLETED', completedAt: new Date() } }),
    prisma.provider.update({ where: { id: provider.id }, data: { totalJobs: { increment: 1 } } }),
  ]);
  return res.json(updated);
};

// POST /api/v1/provider/products
export const addProduct = async (req: AuthRequest, res: Response) => {
  const { name, description, category, price, stockQty, imageUrl } = req.body;
  const provider = await prisma.provider.findUnique({ where: { userId: req.user!.id } });
  if (!provider) return res.status(404).json({ error: 'Provider not found' });
  const product = await prisma.product.create({ data: { providerId: provider.id, name, description, category, price, stockQty, imageUrl } });
  return res.status(201).json(product);
};

// GET /api/v1/provider/products
export const getProducts = async (req: AuthRequest, res: Response) => {
  const provider = await prisma.provider.findUnique({ where: { userId: req.user!.id } });
  if (!provider) return res.status(404).json({ error: 'Provider not found' });
  const products = await prisma.product.findMany({ where: { providerId: provider.id } });
  return res.json(products);
};

// GET /api/v1/provider/earnings
export const getEarnings = async (req: AuthRequest, res: Response) => {
  const provider = await prisma.provider.findUnique({ where: { userId: req.user!.id } });
  if (!provider) return res.status(404).json({ error: 'Provider not found' });
  const earnings = await prisma.booking.groupBy({
    by: ['createdAt'],
    where: { providerId: provider.id, status: 'COMPLETED' },
    _sum: { providerPayout: true },
  });
  return res.json(earnings);
};
