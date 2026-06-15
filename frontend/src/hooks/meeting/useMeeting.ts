import { useEffect, useCallback, useRef, useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useProfileStore } from '@/store/profile.store';
import { io, Socket } from 'socket.io-client';
import { MeetingSocketEvents } from '@/shared/types/company/meeting-socket.type';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:global.stun.twilio.com:3478' },
  ],
};

export function useMeeting(meetingId: string) {
  const { accessToken, userId } = useAuthStore();
  const { userProfile } = useProfileStore();

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Record<string, MediaStream>>({});
  const [participants, setParticipants] = useState<string[]>([]);
  const [participantUserIds, setParticipantUserIds] = useState<Record<string, string>>({});
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [remoteScreenSharers, setRemoteScreenSharers] = useState<Record<string, boolean>>({});
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [eventLog, setEventLog] = useState<string[]>([]);

  // Refs that persist across renders without causing re-renders
  const socketRef = useRef<Socket | null>(null);
  const peerConnections = useRef<Record<string, RTCPeerConnection>>({});
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  const log = (msg: string, data?: unknown) => {
    console.log(`[Meeting] ${msg}`, data ?? '');
    setEventLog(prev => [...prev.slice(-6), `${new Date().toLocaleTimeString()} ${msg}`]);
  };

  // ─── Create WebRTC peer connection ────────────────────────────────────────────
  const createPeerConnection = useCallback((targetSocketId: string): RTCPeerConnection => {
    if (peerConnections.current[targetSocketId]) {
      peerConnections.current[targetSocketId].close();
    }

    const pc = new RTCPeerConnection(ICE_SERVERS);

    const stream = localStreamRef.current;
    if (stream) {
      stream.getTracks().forEach(track => pc.addTrack(track, stream));
    }

    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit(MeetingSocketEvents.WEBRTC_ICE_CANDIDATE, {
          targetSocketId,
          meetingId,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      const incoming = event.streams[0];
      if (!incoming) return;
      log(`Got remote track from ${targetSocketId}`);
      setRemoteStreams(prev => ({ ...prev, [targetSocketId]: incoming }));
    };

    pc.onconnectionstatechange = () => {
      log(`PC state with ${targetSocketId}: ${pc.connectionState}`);
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
        setRemoteStreams(prev => {
          const next = { ...prev };
          delete next[targetSocketId];
          return next;
        });
      }
    };

    peerConnections.current[targetSocketId] = pc;
    return pc;
  }, [meetingId]);

  // ─── Main effect: connect socket, get media, register all handlers ────────────
  useEffect(() => {
    if (!accessToken || !meetingId) return;

    let socket: Socket;
    let destroyed = false;

    const cleanup = () => {
      destroyed = true;
      log('Cleanup: stopping media and closing connections');
      localStreamRef.current?.getTracks().forEach(t => t.stop());
      screenStreamRef.current?.getTracks().forEach(t => t.stop());
      Object.values(peerConnections.current).forEach(pc => pc.close());
      peerConnections.current = {};
      if (socket) {
        socket.emit(MeetingSocketEvents.LEAVE_MEETING, meetingId);
        socket.disconnect();
      }
      socketRef.current = null;
    };

    const init = async () => {
      // Step 1: Get camera/mic (allow failure – still join audio-only)
      let stream: MediaStream | null = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (destroyed) { stream.getTracks().forEach(t => t.stop()); return; }
        localStreamRef.current = stream;
        setLocalStream(stream);
        log('Got local media');
      } catch (err) {
        console.warn('[Meeting] getUserMedia failed, joining without media:', err);
      }

      if (destroyed) return;

      // Step 2: Create socket
      socket = io(`${BACKEND_URL}/meeting`, {
        auth: { token: accessToken },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
      });
      socketRef.current = socket;

      // Step 3: Register ALL event handlers BEFORE the socket connects
      // (socket.io queues events and calls them once connected)

      socket.on('connect', () => {
        if (destroyed) return;
        log(`Socket connected: ${socket.id}`);
        setIsSocketConnected(true);
        // Join the room immediately after connecting
        socket.emit(MeetingSocketEvents.JOIN_MEETING, meetingId);
        log(`Emitted JOIN_MEETING for room ${meetingId}`);
      });

      socket.on('disconnect', (reason) => {
        log(`Socket disconnected: ${reason}`);
        setIsSocketConnected(false);
      });

      socket.on('connect_error', (err) => {
        log(`Socket connect_error: ${err.message}`);
      });

      // ─── USER_JOINED_MEETING ────────────────────────────────────────────────
      socket.on(MeetingSocketEvents.USER_JOINED_MEETING, async (payload: {
        userId: string;
        socketId: string;
        meetingId: string;
        existingParticipants: string[];
      }) => {
        if (destroyed) return;
        log(`USER_JOINED_MEETING: socketId=${payload.socketId} userId=${payload.userId} existing=${JSON.stringify(payload.existingParticipants)}`);

        const { userId: joinedUserId, socketId: joinedSocketId, existingParticipants } = payload;

        if (!joinedSocketId) {
          console.error('[Meeting] Missing socketId in USER_JOINED_MEETING payload! Backend may need restart.');
          return;
        }

        const mySocketId = socket.id;

        if (joinedSocketId === mySocketId) {
          // I just joined — initiate connections to everyone already here
          log(`I joined. Existing participants: ${existingParticipants.join(', ')}`);
          for (const existingId of existingParticipants) {
            setParticipants(prev => prev.includes(existingId) ? prev : [...prev, existingId]);
            try {
              const pc = createPeerConnection(existingId);
              const offer = await pc.createOffer();
              await pc.setLocalDescription(offer);
              socket.emit(MeetingSocketEvents.WEBRTC_OFFER, {
                targetSocketId: existingId,
                meetingId,
                sdp: offer,
              });
              log(`Sent offer to ${existingId}`);
            } catch (e) {
              console.error(`[Meeting] Failed to create offer for ${existingId}`, e);
            }
          }
        } else if (joinedSocketId !== mySocketId) {
          // Someone else joined — add them to participants list
          log(`New participant joined: ${joinedSocketId} (user: ${joinedUserId})`);
          setParticipants(prev => prev.includes(joinedSocketId) ? prev : [...prev, joinedSocketId]);
          setParticipantUserIds(prev => ({ ...prev, [joinedSocketId]: joinedUserId }));
        }
      });

      // ─── USER_LEFT_MEETING ──────────────────────────────────────────────────
      socket.on(MeetingSocketEvents.USER_LEFT_MEETING, ({ socketId: leftId }: { socketId: string }) => {
        if (destroyed) return;
        log(`USER_LEFT_MEETING: ${leftId}`);
        setParticipants(prev => prev.filter(id => id !== leftId));
        setRemoteStreams(prev => { const n = { ...prev }; delete n[leftId]; return n; });
        setParticipantUserIds(prev => { const n = { ...prev }; delete n[leftId]; return n; });
        setRemoteScreenSharers(prev => { const n = { ...prev }; delete n[leftId]; return n; });
        peerConnections.current[leftId]?.close();
        delete peerConnections.current[leftId];
      });

      // ─── WEBRTC_OFFER ───────────────────────────────────────────────────────
      socket.on(MeetingSocketEvents.WEBRTC_OFFER, async ({
        fromSocketId, fromUserId, sdp
      }: { fromSocketId: string; fromUserId: string; sdp: RTCSessionDescriptionInit }) => {
        if (destroyed) return;
        log(`WEBRTC_OFFER from ${fromSocketId}`);
        setParticipants(prev => prev.includes(fromSocketId) ? prev : [...prev, fromSocketId]);
        setParticipantUserIds(prev => ({ ...prev, [fromSocketId]: fromUserId }));
        try {
          const pc = createPeerConnection(fromSocketId);
          await pc.setRemoteDescription(new RTCSessionDescription(sdp));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit(MeetingSocketEvents.WEBRTC_ANSWER, {
            targetSocketId: fromSocketId,
            meetingId,
            sdp: answer,
          });
          log(`Sent answer to ${fromSocketId}`);
        } catch (e) {
          console.error('[Meeting] Error handling offer', e);
        }
      });

      // ─── WEBRTC_ANSWER ──────────────────────────────────────────────────────
      socket.on(MeetingSocketEvents.WEBRTC_ANSWER, async ({
        fromSocketId, fromUserId, sdp
      }: { fromSocketId: string; fromUserId: string; sdp: RTCSessionDescriptionInit }) => {
        if (destroyed) return;
        log(`WEBRTC_ANSWER from ${fromSocketId}`);
        setParticipantUserIds(prev => ({ ...prev, [fromSocketId]: fromUserId }));
        const pc = peerConnections.current[fromSocketId];
        if (pc && pc.signalingState !== 'stable') {
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(sdp));
          } catch (e) {
            console.error('[Meeting] Error setting remote description for answer', e);
          }
        }
      });

      // ─── WEBRTC_ICE_CANDIDATE ───────────────────────────────────────────────
      socket.on(MeetingSocketEvents.WEBRTC_ICE_CANDIDATE, async ({
        fromSocketId, candidate
      }: { fromSocketId: string; candidate: RTCIceCandidateInit }) => {
        if (destroyed) return;
        const pc = peerConnections.current[fromSocketId];
        if (pc) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (e) {
            console.error('[Meeting] Error adding ICE candidate', e);
          }
        }
      });

      // ─── PARTICIPANT_MUTED ──────────────────────────────────────────────────
      socket.on(MeetingSocketEvents.PARTICIPANT_MUTED, ({ participantId }: { participantId: string }) => {
        if (destroyed || userId !== participantId) return;
        const audioTrack = localStreamRef.current?.getAudioTracks()[0];
        if (audioTrack) {
          audioTrack.enabled = false;
          setIsMuted(true);
          socket.emit(MeetingSocketEvents.TOGGLE_AUDIO, { meetingId, isMuted: true });
        }
      });

      // ─── PARTICIPANT_KICKED ─────────────────────────────────────────────────
      socket.on(MeetingSocketEvents.PARTICIPANT_KICKED, ({ participantId }: { participantId: string }) => {
        if (destroyed || userId !== participantId) return;
        alert('You have been removed from the meeting by the host.');
        const role = userProfile?.role;
        window.location.href = role === 'COMPANY_ADMIN' ? '/company-admin/discussions' : '/employee/discussions';
      });

      // ─── MEETING_ENDED ──────────────────────────────────────────────────────
      socket.on(MeetingSocketEvents.MEETING_ENDED, () => {
        if (destroyed) return;
        const role = userProfile?.role;
        window.location.href = role === 'COMPANY_ADMIN' ? '/company-admin/discussions' : '/employee/discussions';
      });

      // ─── SCREEN_SHARE_CHANGED ───────────────────────────────────────────────
      socket.on(MeetingSocketEvents.SCREEN_SHARE_CHANGED, ({
        socketId: sharerSocketId, isSharing
      }: { socketId: string; isSharing: boolean }) => {
        if (destroyed) return;
        setRemoteScreenSharers(prev => ({ ...prev, [sharerSocketId]: isSharing }));
      });
    };

    init();

    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, meetingId]);

  // ─── Controls ─────────────────────────────────────────────────────────────────
  const toggleAudio = useCallback((forceMute?: boolean) => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];
    if (!audioTrack) return;
    setIsMuted(prev => {
      const newMuted = forceMute !== undefined ? forceMute : !prev;
      audioTrack.enabled = !newMuted;
      socketRef.current?.emit(MeetingSocketEvents.TOGGLE_AUDIO, { meetingId, isMuted: newMuted });
      return newMuted;
    });
  }, [meetingId]);

  const toggleVideo = useCallback(() => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (!videoTrack) return;
    setIsVideoOff(prev => {
      const newOff = !prev;
      videoTrack.enabled = !newOff;
      socketRef.current?.emit(MeetingSocketEvents.TOGGLE_VIDEO, { meetingId, isVideoOff: newOff });
      return newOff;
    });
  }, [meetingId]);

  const toggleScreenShare = useCallback(async () => {
    const socket = socketRef.current;
    if (!socket) return;

    if (isScreenSharing && screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(t => t.stop());
      setScreenStream(null);
      setIsScreenSharing(false);
      const original = localStreamRef.current?.getVideoTracks()[0];
      if (original) {
        Object.values(peerConnections.current).forEach(pc => {
          pc.getSenders().find(s => s.track?.kind === 'video')?.replaceTrack(original);
        });
      }
      socket.emit(MeetingSocketEvents.TOGGLE_SCREEN_SHARE, { meetingId, isSharing: false });
      return;
    }

    try {
      const display = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: 'always' } as MediaTrackConstraints,
        audio: false,
      });
      const screenTrack = display.getVideoTracks()[0];
      setScreenStream(display);
      setIsScreenSharing(true);
      Object.values(peerConnections.current).forEach(pc => {
        pc.getSenders().find(s => s.track?.kind === 'video')?.replaceTrack(screenTrack);
      });
      screenTrack.onended = () => {
        setScreenStream(null);
        setIsScreenSharing(false);
        const original = localStreamRef.current?.getVideoTracks()[0];
        if (original) {
          Object.values(peerConnections.current).forEach(pc => {
            pc.getSenders().find(s => s.track?.kind === 'video')?.replaceTrack(original);
          });
        }
        socket.emit(MeetingSocketEvents.TOGGLE_SCREEN_SHARE, { meetingId, isSharing: false });
      };
      socket.emit(MeetingSocketEvents.TOGGLE_SCREEN_SHARE, { meetingId, isSharing: true });
    } catch (err) {
      console.error('[Meeting] Failed to share screen', err);
    }
  }, [meetingId, isScreenSharing]);

  const muteParticipant = useCallback((participantId: string) => {
    socketRef.current?.emit(MeetingSocketEvents.MUTE_PARTICIPANT, { meetingId, participantId });
  }, [meetingId]);

  const kickParticipant = useCallback((_participantId: string) => {}, []);

  return {
    localStream,
    remoteStreams,
    participants,
    participantUserIds,
    isMuted,
    isVideoOff,
    screenStream,
    isScreenSharing,
    remoteScreenSharers,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    muteParticipant,
    kickParticipant,
    isSocketConnected,
    eventLog,
  };
}
