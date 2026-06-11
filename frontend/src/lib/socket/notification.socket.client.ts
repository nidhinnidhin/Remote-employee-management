import { io, Socket } from 'socket.io-client';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

class NotificationSocketClient {
  private socket: Socket | null = null;

  connect(token: string, userId: string) {
    if (this.socket?.connected) return;

    this.socket = io(`${BACKEND_URL}/notifications`, {
      auth: { token },
      transports: ['websocket', 'polling'],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('[Socket] Connected to notifications namespace');
      this.socket?.emit('register', { userId });
    });

    this.socket.on('connect_error', (error) => {
      console.error('[Socket] Notifications connection error:', error.message);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[Socket] Notifications disconnected:', reason);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  on(event: string, callback: Parameters<Socket['on']>[1]) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback?: Parameters<Socket['off']>[1]) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

export const notificationSocketClient = new NotificationSocketClient();
