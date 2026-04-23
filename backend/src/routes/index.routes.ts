import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json({
    api: 'PUNCTUREfix REST API',
    version: '1.0.0',
    status: 'live',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth:     '/api/v1/auth',
      customer: '/api/v1/customer',
      bookings: '/api/v1/bookings',
      provider: '/api/v1/provider',
      payments: '/api/v1/payments',
      admin:    '/api/v1/admin',
    },
    docs: 'https://github.com/PUNCTUREfix/api-docs',
  });
});

export default router;
