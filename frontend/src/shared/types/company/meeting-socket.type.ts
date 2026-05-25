export enum MeetingSocketEvents {
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
