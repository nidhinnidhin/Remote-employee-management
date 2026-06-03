import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { UseGuards, Inject } from '@nestjs/common';
import { WsJwtGuard } from 'src/shared/guards/ws-jwt.guard';
import { SocketEvents } from 'src/shared/types/socket/socket.types';
import type { AuthenticatedSocket } from 'src/shared/types/socket/socket.types';
import type { ISendMessageUseCase } from '../../application/interfaces/chat-use-cases.interface';
import type { IConversationRepository } from '../../domain/repositories/iconversation.repository';
import { SendMessageDto } from '../../application/dto/send-message.dto';
import type { ILogger } from 'src/common/logger/interface/logger.interface';
import { LOGGER_SERVICE } from 'src/common/logger/tokens/logger.tokens';

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
  namespace: 'chat',
})
@UseGuards(WsJwtGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server; 

  constructor(
    @Inject(LOGGER_SERVICE) private readonly logger: ILogger,
    @Inject('ISendMessageUseCase')
    private readonly _sendMessageUseCase: ISendMessageUseCase,
    @Inject('IConversationRepository')
    private readonly _conversationRepository: IConversationRepository,
  ) {}

  notifyConversationUpdate(conversation: any) {
    if (!conversation.participants) return;
    conversation.participants.forEach((participantId: string) => {
      this.server
        .to(`user_${participantId}`)
        .emit(SocketEvents.CONVERSATION_UPDATED, conversation);
    });
  }

  notifyConversationDeletion(conversationId: string) {
    this.server
      .to(conversationId)
      .emit(SocketEvents.CONVERSATION_DELETED, conversationId);
  }

  notifyUserLeft(conversationId: string, userId: string) {
    this.server
      .to(`user_${userId}`)
      .emit(SocketEvents.CONVERSATION_DELETED, conversationId);
    this.server
      .to(conversationId)
      .emit(SocketEvents.CONVERSATION_UPDATED, { id: conversationId });
  }

  notifyMessageUpdate(message: any) {
    this.server
      .to(message.conversationId)
      .emit(SocketEvents.MESSAGE_UPDATED, message);
  }

  notifyMessageDeletion(conversationId: string, messageId: string) {
    this.server.to(conversationId).emit(SocketEvents.MESSAGE_DELETED, {
      conversationId,
      messageId,
      type: 'everyone',
    });
  }

  notifyMessageDeletedForMe(
    conversationId: string,
    messageId: string,
    userId: string,
  ) {
    this.server.to(`user_${userId}`).emit(SocketEvents.MESSAGE_DELETED, {
      conversationId,
      messageId,
      type: 'me',
    });
  }

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers.authorization?.split(' ')[1];
      if (!token) {
        this.logger.warn(`Client connected without token: ${client.id}`);
        void client.disconnect();
        return;
      }

      const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as any;
      const userId = payload.userId;

      client.user = {
        userId: payload.userId,
        role: payload.role,
        companyId: payload.companyId,
      };

      void client.join(`user_${userId}`);
      this.logger.log(
        `Client connected and joined personal room: ${client.id} (User: ${userId})`,
      );
    } catch (error: any) {
      // Fixed: Explicit typing to resolve strict error check
      this.logger.error(`WS Connection auth failed: ${error.message}`);
      void client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage(SocketEvents.JOIN_CONVERSATION)
  handleJoinConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() conversationId: string,
  ) {
    void client.join(conversationId);
    this.logger.log(`Client ${client.id} joined room: ${conversationId}`);
  }

  @SubscribeMessage(SocketEvents.LEAVE_CONVERSATION)
  handleLeaveConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() conversationId: string,
  ) {
    void client.leave(conversationId);
    this.logger.log(`Client ${client.id} left room: ${conversationId}`);
  }

  @SubscribeMessage(SocketEvents.SEND_MESSAGE)
  async handleSendMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() dto: SendMessageDto,
  ) {
    const { userId, companyId } = client.user;

    try {
      const message = await this._sendMessageUseCase.execute(
        companyId,
        userId,
        dto,
      );
      const conversation = await this._conversationRepository.findById(
        dto.conversationId,
      );

      if (conversation) {
        conversation.participants.forEach((participantId: string) => {
          this.server
            .to(`user_${participantId}`)
            .emit(SocketEvents.RECEIVE_MESSAGE, message);
        });
      }

      return { status: 'ok', data: message };
    } catch (error: any) {
      // Fixed: Explicit typing to resolve strict error check
      return { status: 'error', message: error.message };
    }
  }

  @SubscribeMessage(SocketEvents.TYPING)
  async handleTyping(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() conversationId: string,
  ) {
    const conversation =
      await this._conversationRepository.findById(conversationId);
    if (conversation) {
      conversation.participants.forEach((participantId: string) => {
        if (participantId !== client.user.userId) {
          this.server.to(`user_${participantId}`).emit(SocketEvents.TYPING, {
            userId: client.user.userId,
            conversationId,
          });
        }
      });
    }
  }

  @SubscribeMessage(SocketEvents.STOP_TYPING)
  async handleStopTyping(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() conversationId: string,
  ) {
    const conversation =
      await this._conversationRepository.findById(conversationId);
    if (conversation) {
      conversation.participants.forEach((participantId: string) => {
        if (participantId !== client.user.userId) {
          this.server
            .to(`user_${participantId}`)
            .emit(SocketEvents.STOP_TYPING, {
              userId: client.user.userId,
              conversationId,
            });
        }
      });
    }
  }
}
