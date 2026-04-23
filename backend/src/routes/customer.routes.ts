import { Router } from 'express';
import { authenticate } from '../auth/middleware';
import {
  getProfile, updateProfile, addVehicle, getVehicles, deleteVehicle, getBookings
} from '../controllers/customer.controller';

const router = Router();
router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/vehicles', addVehicle);
router.get('/vehicles', getVehicles);
router.delete('/vehicles/:id', deleteVehicle);
router.get('/bookings', getBookings);

export default router;
