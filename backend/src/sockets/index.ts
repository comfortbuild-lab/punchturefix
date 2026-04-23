import { Server } from 'socket.io';

export const registerSocketHandlers = (io: Server) => {
  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // Join a booking room for real-time tracking
    socket.on('booking:join', (bookingId: string) => {
      socket.join(`booking_${bookingId}`);
      console.log(`[Socket] Client joined room: booking_${bookingId}`);
    });

    // Provider emits their GPS location every ~5s while en route
    socket.on('provider:location', (data: { bookingId: string; lat: number; lng: number }) => {
      io.to(`booking_${data.bookingId}`).emit('provider:location', { lat: data.lat, lng: data.lng });
    });

    // Provider status transitions
    socket.on('booking:en_route', (bookingId: string) => {
      io.to(`booking_${bookingId}`).emit('booking:en_route', { bookingId });
    });

    socket.on('booking:arrived', (bookingId: string) => {
      io.to(`booking_${bookingId}`).emit('booking:arrived', { bookingId });
    });

    socket.on('booking:started', (bookingId: string) => {
      io.to(`booking_${bookingId}`).emit('booking:started', { bookingId });
    });

    socket.on('booking:completed', (bookingId: string) => {
      io.to(`booking_${bookingId}`).emit('booking:completed', { bookingId });
      // Prompt customer to review
      io.to(`booking_${bookingId}`).emit('review:prompt', { bookingId });
    });

    socket.on('booking:cancelled', (bookingId: string) => {
      io.to(`booking_${bookingId}`).emit('booking:cancelled', { bookingId });
    });

    // In-app chat between customer and provider within a booking
    socket.on('chat:message', (data: { bookingId: string; senderId: string; message: string }) => {
      io.to(`booking_${data.bookingId}`).emit('chat:message', {
        bookingId: data.bookingId,
        senderId: data.senderId,
        message: data.message,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });
};
