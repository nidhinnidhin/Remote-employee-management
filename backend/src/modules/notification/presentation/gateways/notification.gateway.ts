import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from 'src/shared/guards/ws-jwt.guard';
import { NotificationEntity } from '../../domain/entities/notification.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/notifications',
})
@UseGuards(WsJwtGuard)
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  // Track connected users: userId -> socketId[]
  private connectedUsers = new Map<string, string[]>();

  handleConnection(client: Socket) {
    // Expected to join a room or register when authenticated
    console.log(`Client connected to notifications: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected from notifications: ${client.id}`);
    this.removeSocketFromUsers(client.id);
  }

  @SubscribeMessage('register')
  handleRegister(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { userId } = data;
    if (!userId) return;

    if (!this.connectedUsers.has(userId)) {
      this.connectedUsers.set(userId, []);
    }
    const userSockets = this.connectedUsers.get(userId)!;
    if (!userSockets.includes(client.id)) {
      userSockets.push(client.id);
    }
    
    // Also join a room for the user to make broadcasting easier
    client.join(`user_${userId}`);
    
    return { status: 'registered' };
  }

  private removeSocketFromUsers(socketId: string) {
    for (const [userId, sockets] of this.connectedUsers.entries()) {
      const index = sockets.indexOf(socketId);
      if (index !== -1) {
        sockets.splice(index, 1);
        if (sockets.length === 0) {
          this.connectedUsers.delete(userId);
        }
        break;
      }
    }
  }

  // Method called by CreateNotificationUseCase
  sendNotificationToUser(userId: string, notification: NotificationEntity) {
    this.server.to(`user_${userId}`).emit('new_notification', notification);
  }
}
