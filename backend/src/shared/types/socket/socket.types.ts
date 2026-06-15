// src/shared/types/socket/socket.types.ts
import { Socket } from 'socket.io';

export interface AuthenticatedSocket extends Socket {
  user: {
    userId: string;
    role: string;
    companyId: string;
  };
}

export enum SocketEvents {
  // Chat events
  SEND_MESSAGE = 'send_message',
  RECEIVE_MESSAGE = 'receive_message',
  MESSAGE_UPDATED = 'message_updated',
  MESSAGE_DELETED = 'message_deleted',
  NEW_CONVERSATION = 'new_conversation',
  CONVERSATION_UPDATED = 'conversation_updated',
  CONVERSATION_DELETED = 'conversation_deleted',
  JOIN_CONVERSATION = 'join_conversation',
  LEAVE_CONVERSATION = 'leave_conversation',
  TYPING = 'typing',
  STOP_TYPING = 'stop_typing',
  
  // Notification events
  NOTIFICATION = 'notification',

  // Meeting events
  JOIN_MEETING = 'join_meeting',
  LEAVE_MEETING = 'leave_meeting',
  USER_JOINED_MEETING = 'user_joined_meeting',
  USER_LEFT_MEETING = 'user_left_meeting',
  MEETING_ENDED = 'meeting_ended',
  
  TOGGLE_AUDIO = 'toggle_audio',
  AUDIO_STATUS_CHANGED = 'audio_status_changed',
  
  TOGGLE_VIDEO = 'toggle_video',
  VIDEO_STATUS_CHANGED = 'video_status_changed',
  
  TOGGLE_SCREEN_SHARE = 'toggle_screen_share',
  SCREEN_SHARE_CHANGED = 'screen_share_changed',
  
  MUTE_PARTICIPANT = 'mute_participant',
  PARTICIPANT_MUTED = 'participant_muted',
  
  UNMUTE_PARTICIPANT = 'unmute_participant',
  PARTICIPANT_UNMUTED = 'participant_unmuted',
  
  KICK_PARTICIPANT = 'kick_participant',
  PARTICIPANT_KICKED = 'participant_kicked',
  
  WEBRTC_OFFER = 'webrtc_offer',
  WEBRTC_ANSWER = 'webrtc_answer',
  WEBRTC_ICE_CANDIDATE = 'webrtc_ice_candidate',
}
