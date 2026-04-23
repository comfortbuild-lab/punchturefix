import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { registerSocketHandlers } from './sockets';

// Routes
import indexRoutes from './routes/index.routes';
import authRoutes from './routes/auth.routes';
import customerRoutes from './routes/customer.routes';
import bookingRoutes from './routes/booking.routes';
import providerRoutes from './routes/provider.routes';
import paymentRoutes from './routes/payment.routes';
import adminRoutes from './routes/admin.routes';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(cookieParser());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: '🚨 PUNCTUREfix API is Live', version: '1.0.0' });
});

// API Routes
const api = '/api/v1';
app.use(api, indexRoutes);            // GET /api/v1 — endpoint directory
app.use(`${api}/auth`, authRoutes);
app.use(`${api}/customer`, customerRoutes);
app.use(`${api}/bookings`, bookingRoutes);
app.use(`${api}/provider`, providerRoutes);
app.use(`${api}/payments`, paymentRoutes);
app.use(`${api}/admin`, adminRoutes);

// 404
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Socket.IO
registerSocketHandlers(io);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 PUNCTUREfix Backend running on port ${PORT}`);
  console.log(`📡 Socket.IO ready for real-time connections`);
});

export { app, io };
