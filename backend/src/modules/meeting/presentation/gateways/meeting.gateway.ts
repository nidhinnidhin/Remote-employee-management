// src/modules/meeting/presentation/gateways/meeting.gateway.ts
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
import { Inject } from '@nestjs/common';
import { SocketEvents } from 'src/shared/types/socket/socket.types';
import type { AuthenticatedSocket } from 'src/shared/types/socket/socket.types';
import type { ILogger } from 'src/common/logger/interface/logger.interface';
import { LOGGER_SERVICE } from 'src/common/logger/tokens/logger.tokens';
import type { IMeetingRepository } from '../../domain/repositories/imeeting.repository';

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
  namespace: 'meeting',
})
export class MeetingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  constructor(
    @Inject(LOGGER_SERVICE) private readonly logger: ILogger,
    @Inject('IMeetingRepository')
    private readonly _meetingRepository: IMeetingRepository,
  ) {}

  private readonly roomParticipants = new Map<string, Set<string>>();

  notifyMeetingEnded(meetingId: string) {
    this.server.to(meetingId).emit(SocketEvents.MEETING_ENDED, meetingId);
  }

  notifyParticipantKicked(meetingId: string, participantId: string) {
    this.server
      .to(meetingId)
      .emit(SocketEvents.PARTICIPANT_KICKED, { meetingId, participantId });
    // Also notify directly to their personal channel just in case
    this.server
      .to(`user_${participantId}`)
      .emit(SocketEvents.PARTICIPANT_KICKED, { meetingId, participantId });
  }

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        this.logger.warn(
          `Client connected without token to meeting ns: ${client.id}`,
        );
        void client.disconnect();
        return;
      }

      const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as { userId: string; role: string; companyId: string };
      const userId = payload.userId;

      client.user = {
        userId: payload.userId,
        role: payload.role,
        companyId: payload.companyId,
      };

      void client.join(`user_${userId}`);
      this.logger.log(
        `Client connected to meeting ns: ${client.id} (User: ${userId})`,
      );
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(`Meeting WS Connection auth failed: ${err.message}`);
      void client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`Client disconnected from meeting ns: ${client.id}`);
    this.roomParticipants.forEach((participants, meetingId) => {
      if (participants.has(client.id)) {
        participants.delete(client.id);
        if (participants.size === 0) {
          this.roomParticipants.delete(meetingId);
        }
        this.server.to(meetingId).emit(SocketEvents.USER_LEFT_MEETING, {
          userId: client.user?.userId,
          socketId: client.id,
          meetingId,
        });
      }
    });
  }

  @SubscribeMessage(SocketEvents.JOIN_MEETING)
  async handleJoinMeeting(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() meetingId: string,
  ) {
    if (!client.user) {
      this.logger.warn(
        `Unauthenticated JOIN_MEETING attempt from ${client.id}`,
      );
      return;
    }

    if (!this.roomParticipants.has(meetingId)) {
      this.roomParticipants.set(meetingId, new Set());
    }
    const roomSet = this.roomParticipants.get(meetingId)!;
    const existingSocketIds = Array.from(roomSet); // everyone already here

    roomSet.add(client.id);

    void client.join(meetingId);
    this.logger.log(
      `Client ${client.id} (User: ${client.user.userId}) joined meeting room: ${meetingId}. Existing: [${existingSocketIds.join(', ')}]`,
    );

    client.emit(SocketEvents.USER_JOINED_MEETING, {
      userId: client.user.userId,
      socketId: client.id,
      meetingId,
      existingParticipants: existingSocketIds,
    });

    client.to(meetingId).emit(SocketEvents.USER_JOINED_MEETING, {
      userId: client.user.userId,
      socketId: client.id,
      meetingId,
      existingParticipants: [],
    });
  }

  @SubscribeMessage(SocketEvents.LEAVE_MEETING)
  handleLeaveMeeting(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() meetingId: string,
  ) {
    const roomSet = this.roomParticipants.get(meetingId);
    if (roomSet) {
      roomSet.delete(client.id);
      if (roomSet.size === 0) this.roomParticipants.delete(meetingId);
    }
    void client.leave(meetingId);
    this.logger.log(`Client ${client.id} left meeting room: ${meetingId}`);
    client.to(meetingId).emit(SocketEvents.USER_LEFT_MEETING, {
      userId: client.user?.userId,
      socketId: client.id,
      meetingId,
    });
  }

  @SubscribeMessage(SocketEvents.TOGGLE_AUDIO)
  handleToggleAudio(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { meetingId: string; isMuted: boolean },
  ) {
    client.to(data.meetingId).emit(SocketEvents.AUDIO_STATUS_CHANGED, {
      userId: client.user.userId,
      socketId: client.id,
      isMuted: data.isMuted,
    });
  }

  @SubscribeMessage(SocketEvents.TOGGLE_VIDEO)
  handleToggleVideo(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { meetingId: string; isVideoOff: boolean },
  ) {
    client.to(data.meetingId).emit(SocketEvents.VIDEO_STATUS_CHANGED, {
      userId: client.user.userId,
      socketId: client.id,
      isVideoOff: data.isVideoOff,
    });
  }

  @SubscribeMessage(SocketEvents.TOGGLE_SCREEN_SHARE)
  handleToggleScreenShare(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { meetingId: string; isSharing: boolean },
  ) {
    client.to(data.meetingId).emit(SocketEvents.SCREEN_SHARE_CHANGED, {
      userId: client.user.userId,
      socketId: client.id,
      isSharing: data.isSharing,
    });
  }

  @SubscribeMessage(SocketEvents.MUTE_PARTICIPANT)
  async handleMuteParticipant(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { meetingId: string; participantId: string },
  ) {
    const meeting = await this._meetingRepository.findById(data.meetingId);
    // Only creator can force mute
    if (meeting && meeting.creatorId === client.user.userId) {
      this.server.to(data.meetingId).emit(SocketEvents.PARTICIPANT_MUTED, {
        meetingId: data.meetingId,
        participantId: data.participantId,
        mutedBy: client.user.userId,
      });
    }
  }

  @SubscribeMessage(SocketEvents.UNMUTE_PARTICIPANT)
  async handleUnmuteParticipant(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { meetingId: string; participantId: string },
  ) {
    const meeting = await this._meetingRepository.findById(data.meetingId);
    // Only creator can force unmute
    if (meeting && meeting.creatorId === client.user.userId) {
      this.server.to(data.meetingId).emit(SocketEvents.PARTICIPANT_UNMUTED, {
        meetingId: data.meetingId,
        participantId: data.participantId,
        unmutedBy: client.user.userId,
      });
    }
  }

  // --- WebRTC Signaling Events ---

  @SubscribeMessage(SocketEvents.WEBRTC_OFFER)
  handleWebRTCOffer(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody()
    data: { targetSocketId: string; meetingId: string; sdp: Record<string, unknown> },
  ) {
    this.server.to(data.targetSocketId).emit(SocketEvents.WEBRTC_OFFER, {
      fromSocketId: client.id,
      fromUserId: client.user.userId,
      sdp: data.sdp,
      meetingId: data.meetingId,
    });
  }

  @SubscribeMessage(SocketEvents.WEBRTC_ANSWER)
  handleWebRTCAnswer(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody()
    data: { targetSocketId: string; meetingId: string; sdp: Record<string, unknown> },
  ) {
    this.server.to(data.targetSocketId).emit(SocketEvents.WEBRTC_ANSWER, {
      fromSocketId: client.id,
      fromUserId: client.user.userId,
      sdp: data.sdp,
      meetingId: data.meetingId,
    });
  }

  @SubscribeMessage(SocketEvents.WEBRTC_ICE_CANDIDATE)
  handleWebRTCICECandidate(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody()
    data: { targetSocketId: string; meetingId: string; candidate: Record<string, unknown> },
  ) {
    this.server
      .to(data.targetSocketId)
      .emit(SocketEvents.WEBRTC_ICE_CANDIDATE, {
        fromSocketId: client.id,
        fromUserId: client.user.userId,
        candidate: data.candidate,
        meetingId: data.meetingId,
      });
  }
}
