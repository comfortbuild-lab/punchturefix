import { Router } from 'express';
import { authenticate, requireRole } from '../auth/middleware';
import {
  registerProvider, getDashboard, toggleAvailability,
  addService, getServices, updateService, deleteService,
  getJobs, acceptJob, completeJob,
  addProduct, getProducts, getEarnings
} from '../controllers/provider.controller';

const router = Router();

// Registration is open (requires auth but not PROVIDER role yet)
router.post('/register', authenticate, registerProvider);

// All other routes require PROVIDER role
router.use(authenticate, requireRole('PROVIDER', 'ADMIN'));

router.get('/dashboard', getDashboard);
router.patch('/availability', toggleAvailability);

router.get('/services', getServices);
router.post('/services', addService);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);

router.get('/jobs', getJobs);
router.patch('/jobs/:id/accept', acceptJob);
router.patch('/jobs/:id/complete', completeJob);

router.get('/products', getProducts);
router.post('/products', addProduct);

router.get('/earnings', getEarnings);

export default router;
