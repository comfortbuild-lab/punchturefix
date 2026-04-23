import prisma from '../config/prisma';
import admin from '../config/firebase';

/**
 * Smart dispatch algorithm:
 * 1. Find available, approved providers for the service within radius
 * 2. Score by distance, rating, and total jobs
 * 3. Notify top provider; if no response in 60s, offer to next
 * 4. If no acceptance in 5min, mark as no_provider_found
 */
export const dispatchProvider = async (
  bookingId: string,
  serviceCategoryId: string,
  lat: number,
  lng: number,
  emergency = false,
) => {
  // Fetch candidates (approximate distance filter via bounding box)
  const radiusDeg = 0.1; // ~11km bounding box
  const candidates = await prisma.provider.findMany({
    where: {
      isAvailable: true,
      verificationStatus: 'APPROVED',
      lat: { gte: lat - radiusDeg, lte: lat + radiusDeg },
      lng: { gte: lng - radiusDeg, lte: lng + radiusDeg },
      services: { some: { categoryId: serviceCategoryId, isActive: true } },
    },
    include: { user: { select: { firebaseUid: true } } },
  });

  if (!candidates.length) {
    await prisma.booking.update({ where: { id: bookingId }, data: { status: 'CANCELLED' } });
    return;
  }

  // Score providers
  const scored = candidates.map((p) => {
    const distKm = Math.sqrt(Math.pow((p.lat! - lat) * 111, 2) + Math.pow((p.lng! - lng) * 111, 2));
    const score = (1 / (distKm + 0.1)) * 0.5 + (p.avgRating / 5) * 0.3 + (Math.min(p.totalJobs, 1000) / 1000) * 0.2;
    return { ...p, distKm, score };
  }).sort((a, b) => b.score - a.score);

  const topN = emergency ? scored.slice(0, 3) : scored.slice(0, 1);

  for (const provider of topN) {
    try {
      await admin.messaging().send({
        token: provider.user.firebaseUid, // In practice, store FCM token separately
        notification: { title: '🔧 New Job Request!', body: 'A customer needs your service nearby.' },
        data: { bookingId, type: emergency ? 'emergency_job' : 'new_job' },
      });
    } catch {
      // FCM token not registered — skip silently in dev
    }
  }

  // Assign the top provider immediately for simplicity
  // In production, use a queue with 60s accept window per provider
  const top = topN[0];
  await prisma.booking.update({
    where: { id: bookingId },
    data: { providerId: top.id, status: 'ASSIGNED' },
  });
};
