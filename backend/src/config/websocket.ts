import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';

let io: SocketIOServer;

export const initializeWebSocket = (server: HTTPServer) => {
    io = new SocketIOServer(server, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3100',
            credentials: true,
        },
    });

    // Authentication middleware
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error('Authentication error'));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            socket.data.user = decoded;
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`✅ Client connected: ${socket.id}`);

        // Join user-specific room
        const userId = socket.data.user?.id;
        if (userId) {
            socket.join(`user:${userId}`);
        }

        socket.on('disconnect', () => {
            console.log(`❌ Client disconnected: ${socket.id}`);
        });
    });

    console.log('✅ WebSocket server initialized');
    return io;
};

export const getIO = (): SocketIOServer => {
    if (!io) {
        throw new Error('WebSocket not initialized');
    }
    return io;
};

// Helper functions for emitting events
export const emitToUser = (userId: string, event: string, data: any) => {
    getIO().to(`user:${userId}`).emit(event, data);
};

export const emitToAll = (event: string, data: any) => {
    getIO().emit(event, data);
};
