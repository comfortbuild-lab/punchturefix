import { Router } from 'express';
import { authenticate } from '../auth/middleware';
import {
  createOnDemandBooking, createScheduledBooking, createSelfWashBooking,
  trackBooking, cancelBooking, submitReview, createEmergencyBooking
} from '../controllers/booking.controller';

const router = Router();
router.use(authenticate);

router.post('/on-demand', createOnDemandBooking);
router.post('/scheduled', createScheduledBooking);
router.post('/self-wash', createSelfWashBooking);
router.post('/emergency', createEmergencyBooking);
router.get('/:id/track', trackBooking);
router.post('/:id/cancel', cancelBooking);
router.post('/:id/review', submitReview);

export default router;
