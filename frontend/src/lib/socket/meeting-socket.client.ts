import { io, Socket } from 'socket.io-client';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')

class MeetingSocketClient {
  private socket: Socket | null = null;

  connect(token: string) {
    if (this.socket?.connected) return;

    this.socket = io(`${BACKEND_URL}/meeting`, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('Meeting Socket connected:', this.socket?.id);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Meeting Socket connection error:', error);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Meeting Socket disconnected:', reason);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }

  emit(event: string, data?: unknown) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
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

export const meetingSocketClient = new MeetingSocketClient();
