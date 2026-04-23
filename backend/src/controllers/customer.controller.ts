import { Response } from 'express';
import { AuthRequest } from '../auth/middleware';
import prisma from '../config/prisma';

// GET /api/v1/customer/profile
export const getProfile = async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: { vehicles: true, subscriptions: { where: { isActive: true } } },
  });
  return res.json(user);
};

// PUT /api/v1/customer/profile
export const updateProfile = async (req: AuthRequest, res: Response) => {
  const { name, avatarUrl, city } = req.body;
  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: { name, avatarUrl, city },
  });
  return res.json(user);
};

// POST /api/v1/customer/vehicles
export const addVehicle = async (req: AuthRequest, res: Response) => {
  const { make, model, year, fuelType, registrationNo, color } = req.body;
  if (!make || !model || !registrationNo) {
    return res.status(400).json({ error: 'make, model, and registrationNo are required' });
  }
  const vehicle = await prisma.vehicle.create({
    data: { userId: req.user!.id, make, model, year, fuelType, registrationNo, color },
  });
  return res.status(201).json(vehicle);
};

// GET /api/v1/customer/vehicles
export const getVehicles = async (req: AuthRequest, res: Response) => {
  const vehicles = await prisma.vehicle.findMany({ where: { userId: req.user!.id } });
  return res.json(vehicles);
};

// DELETE /api/v1/customer/vehicles/:id
export const deleteVehicle = async (req: AuthRequest, res: Response) => {
  const vehicle = await prisma.vehicle.findFirst({
    where: { id: req.params.id, userId: req.user!.id },
  });
  if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
  await prisma.vehicle.delete({ where: { id: req.params.id } });
  return res.json({ message: 'Vehicle removed' });
};

// GET /api/v1/customer/bookings
export const getBookings = async (req: AuthRequest, res: Response) => {
  const bookings = await prisma.booking.findMany({
    where: { customerId: req.user!.id },
    include: { serviceCategory: true, provider: { include: { user: true } }, vehicle: true },
    orderBy: { createdAt: 'desc' },
  });
  return res.json(bookings);
};
