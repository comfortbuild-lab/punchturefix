import { Response } from 'express';
import { AuthRequest } from '../auth/middleware';
import prisma from '../config/prisma';
import { dispatchProvider } from '../services/dispatch.service';
import crypto from 'crypto';

// POST /api/v1/bookings/on-demand
export const createOnDemandBooking = async (req: AuthRequest, res: Response) => {
  const { serviceCategoryId, vehicleId, lat, lng, address, notes } = req.body;
  if (!serviceCategoryId || !lat || !lng || !address) {
    return res.status(400).json({ error: 'serviceCategoryId, lat, lng, and address are required' });
  }

  // Get platform fee config (20% platform, 80% provider)
  const serviceCategory = await prisma.serviceCategory.findUnique({ where: { id: serviceCategoryId } });
  if (!serviceCategory) return res.status(404).json({ error: 'Service category not found' });

  const totalAmount = serviceCategory.basePriceMin;
  const platformFee = totalAmount * 0.2;
  const providerPayout = totalAmount * 0.8;

  const booking = await prisma.booking.create({
    data: {
      customerId: req.user!.id,
      vehicleId: vehicleId || null,
      serviceCategoryId,
      locationAddress: address,
      locationLat: lat,
      locationLng: lng,
      customerNotes: notes || null,
      bookingType: 'on_demand',
      status: 'PENDING',
      totalAmount,
      platformFee,
      providerPayout,
    },
  });

  // Trigger smart dispatch in background
  dispatchProvider(booking.id, serviceCategoryId, lat, lng).catch(console.error);

  return res.status(201).json({
    booking,
    message: 'Booking created, searching for nearest provider...',
  });
};

// POST /api/v1/bookings/scheduled
export const createScheduledBooking = async (req: AuthRequest, res: Response) => {
  const { serviceCategoryId, vehicleId, address, scheduledAt, notes } = req.body;
  if (!serviceCategoryId || !address || !scheduledAt) {
    return res.status(400).json({ error: 'serviceCategoryId, address, and scheduledAt are required' });
  }

  const serviceCategory = await prisma.serviceCategory.findUnique({ where: { id: serviceCategoryId } });
  if (!serviceCategory) return res.status(404).json({ error: 'Service category not found' });

  const totalAmount = serviceCategory.basePriceMin;
  const booking = await prisma.booking.create({
    data: {
      customerId: req.user!.id,
      vehicleId: vehicleId || null,
      serviceCategoryId,
      locationAddress: address,
      locationLat: 0, locationLng: 0,
      customerNotes: notes || null,
      bookingType: 'scheduled',
      status: 'PENDING',
      scheduledAt: new Date(scheduledAt),
      totalAmount,
      platformFee: totalAmount * 0.2,
      providerPayout: totalAmount * 0.8,
    },
  });

  return res.status(201).json({ booking, confirmationNumber: booking.id.slice(0, 8).toUpperCase() });
};

// POST /api/v1/bookings/self-wash
export const createSelfWashBooking = async (req: AuthRequest, res: Response) => {
  const { bayId, slotId, vehicleId } = req.body;
  const slot = await prisma.washBaySlot.findUnique({ where: { id: slotId }, include: { bay: true } });
  if (!slot || slot.bayId !== bayId) return res.status(404).json({ error: 'Slot not found' });
  if (slot.isBooked) return res.status(409).json({ error: 'Slot already booked' });

  const qrToken = crypto.randomBytes(16).toString('hex');
  const booking = await prisma.booking.create({
    data: {
      customerId: req.user!.id,
      vehicleId: vehicleId || null,
      serviceCategoryId: (await prisma.serviceCategory.findFirst({ where: { name: 'self_wash_bay' } }))?.id || '',
      locationAddress: slot.bay.address,
      locationLat: slot.bay.lat,
      locationLng: slot.bay.lng,
      bookingType: 'self_wash',
      status: 'PENDING',
      totalAmount: slot.bay.pricePerSlot,
      platformFee: slot.bay.pricePerSlot * 0.2,
      providerPayout: slot.bay.pricePerSlot * 0.8,
    },
  });

  await prisma.washBaySlot.update({
    where: { id: slotId },
    data: { isBooked: true, bookingId: booking.id, qrCodeToken: qrToken, qrExpiresAt: new Date(Date.now() + 30 * 60 * 1000) },
  });

  return res.status(201).json({ booking, qrToken, slotDetails: slot });
};

// GET /api/v1/bookings/:id/track
export const trackBooking = async (req: AuthRequest, res: Response) => {
  const booking = await prisma.booking.findFirst({
    where: { id: req.params.id, customerId: req.user!.id },
    include: { provider: { include: { user: true } }, serviceCategory: true },
  });
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  return res.json(booking);
};

// POST /api/v1/bookings/:id/cancel
export const cancelBooking = async (req: AuthRequest, res: Response) => {
  const booking = await prisma.booking.findFirst({
    where: { id: req.params.id, customerId: req.user!.id },
  });
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  if (['IN_PROGRESS', 'COMPLETED'].includes(booking.status)) {
    return res.status(400).json({ error: 'Cannot cancel a booking in progress or completed' });
  }
  await prisma.booking.update({ where: { id: booking.id }, data: { status: 'CANCELLED' } });
  return res.json({ message: 'Booking cancelled' });
};

// POST /api/v1/bookings/:id/review
export const submitReview = async (req: AuthRequest, res: Response) => {
  const { rating, comment } = req.body;
  const booking = await prisma.booking.findFirst({
    where: { id: req.params.id, customerId: req.user!.id, status: 'COMPLETED' },
  });
  if (!booking) return res.status(404).json({ error: 'Completed booking not found' });
  if (!booking.providerId) return res.status(400).json({ error: 'No provider on this booking' });
  if (!(rating >= 1 && rating <= 5)) return res.status(400).json({ error: 'Rating must be 1-5' });

  const review = await prisma.review.create({
    data: { bookingId: booking.id, customerId: req.user!.id, providerId: booking.providerId, rating, comment },
  });

  // Update provider average rating
  const agg = await prisma.review.aggregate({ where: { providerId: booking.providerId }, _avg: { rating: true } });
  await prisma.provider.update({ where: { id: booking.providerId }, data: { avgRating: agg._avg.rating ?? 0 } });

  return res.status(201).json(review);
};

// POST /api/v1/bookings/emergency
export const createEmergencyBooking = async (req: AuthRequest, res: Response) => {
  const { serviceCategoryId, vehicleId, lat, lng, address } = req.body;
  const serviceCategory = await prisma.serviceCategory.findUnique({ where: { id: serviceCategoryId } });
  if (!serviceCategory) return res.status(404).json({ error: 'Service category not found' });

  const booking = await prisma.booking.create({
    data: {
      customerId: req.user!.id,
      vehicleId: vehicleId || null,
      serviceCategoryId,
      locationAddress: address,
      locationLat: lat,
      locationLng: lng,
      bookingType: 'on_demand',
      status: 'PENDING',
      customerNotes: 'EMERGENCY - Priority Dispatch',
      totalAmount: serviceCategory.basePriceMin,
      platformFee: serviceCategory.basePriceMin * 0.2,
      providerPayout: serviceCategory.basePriceMin * 0.8,
    },
  });

  // Emergency dispatch: notify top 3 providers simultaneously
  dispatchProvider(booking.id, serviceCategoryId, lat, lng, true).catch(console.error);
  return res.status(201).json({ booking, message: '🚨 Emergency dispatch triggered' });
};
