import { useEffect, useCallback, useRef, useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useProfileStore } from '@/store/profile.store';
import { io, Socket } from 'socket.io-client';
import { MeetingSocketEvents } from '@/shared/types/company/meeting-socket.type';

// CRITICAL FIX: Use NEXT_PUBLIC_API_URL so the browser resolves the real backend host in production.
// API_URL_INTERNAL is a server-side-only variable and is ALWAYS undefined in the browser,
// which caused the socket to silently connect to localhost:4000 instead of the AWS backend.
const BACKEND_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
).replace(/\/api$/, '');

// Build ICE server list including optional TURN relay servers.
// STUN-only configuration fails for peers behind symmetric NAT (common in AWS / mobile networks).
// To enable TURN, set these env vars in your frontend .env:
//   NEXT_PUBLIC_TURN_URL=turn:your-turn-server.com:3478
//   NEXT_PUBLIC_TURN_USERNAME=your_username
//   NEXT_PUBLIC_TURN_CREDENTIAL=your_password
function buildIceServers(): RTCIceServer[] {
  const servers: RTCIceServer[] = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:global.stun.twilio.com:3478' },
  ];

  const turnUrl = process.env.NEXT_PUBLIC_TURN_URL;
  const turnUsername = process.env.NEXT_PUBLIC_TURN_USERNAME;
  const turnCredential = process.env.NEXT_PUBLIC_TURN_CREDENTIAL;

  if (turnUrl && turnUsername && turnCredential) {
    servers.push(
      { urls: turnUrl, username: turnUsername, credential: turnCredential },
    );
    // Also add TURNS (TLS) variant for networks that block UDP
    const turnsUrl = turnUrl.replace(/^turn:/, 'turns:').replace(/:3478$/, ':5349');
    if (turnsUrl !== turnUrl) {
      servers.push({ urls: turnsUrl, username: turnUsername, credential: turnCredential });
    }
  } else {
    console.warn(
      '[Meeting] No TURN server configured (NEXT_PUBLIC_TURN_URL / TURN_USERNAME / TURN_CREDENTIAL). ' +
      'WebRTC may fail for users behind NAT in production/AWS deployments.',
    );
  }

  return servers;
}

// Shape sent by the backend for participants already in the room when a new user joins.
interface ExistingParticipant {
  socketId: string;
  userId: string;
}

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
  // ICE candidates that arrive before a peer connection's remote description is set are queued here.
  const pendingCandidatesRef = useRef<Record<string, RTCIceCandidateInit[]>>({});

  // ─── Create WebRTC peer connection ────────────────────────────────────────────
  const createPeerConnection = useCallback((targetSocketId: string): RTCPeerConnection => {
    // Close any stale connection for this peer
    if (peerConnections.current[targetSocketId]) {
      peerConnections.current[targetSocketId].close();
    }

    const pc = new RTCPeerConnection({ iceServers: buildIceServers() });

    // Add all local tracks so the remote peer can receive our media
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
      console.log(`[Meeting] Got remote track from ${targetSocketId}`);
      setRemoteStreams(prev => ({ ...prev, [targetSocketId]: incoming }));
    };

    pc.onconnectionstatechange = () => {
      console.log(`[Meeting] PC state with ${targetSocketId}: ${pc.connectionState}`);
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

    // Apply ICE candidates that arrived before setRemoteDescription was called.
    // This fixes the common race condition where ICE candidates are silently dropped.
    const applyPendingCandidates = async (socketId: string, pc: RTCPeerConnection) => {
      const pending = pendingCandidatesRef.current[socketId];
      if (!pending || pending.length === 0) return;
      console.log(`[Meeting] Applying ${pending.length} queued ICE candidates for ${socketId}`);
      delete pendingCandidatesRef.current[socketId];
      for (const candidate of pending) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.error('[Meeting] Error adding queued ICE candidate', e);
        }
      }
    };

    const cleanup = () => {
      destroyed = true;
      console.log('[Meeting] Cleanup: stopping media and closing connections');
      localStreamRef.current?.getTracks().forEach(t => t.stop());
      screenStreamRef.current?.getTracks().forEach(t => t.stop());
      Object.values(peerConnections.current).forEach(pc => pc.close());
      peerConnections.current = {};
      pendingCandidatesRef.current = {};
      if (socket) {
        socket.emit(MeetingSocketEvents.LEAVE_MEETING, meetingId);
        socket.disconnect();
      }
      socketRef.current = null;
    };

    const init = async () => {
      // Step 1: Get camera/mic (allow failure – user can still join audio/video-only)
      let stream: MediaStream | null = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (destroyed) { stream.getTracks().forEach(t => t.stop()); return; }
        localStreamRef.current = stream;
        setLocalStream(stream);
        console.log('[Meeting] Got local media');
      } catch (err) {
        console.warn('[Meeting] getUserMedia failed, joining without media:', err);
      }

      if (destroyed) return;

      // Step 2: Create socket using the correct public backend URL
      console.log(`[Meeting] Connecting socket to: ${BACKEND_URL}/meeting`);
      socket = io(`${BACKEND_URL}/meeting`, {
        auth: { token: accessToken },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
      });
      socketRef.current = socket;

      // Step 3: Register ALL event handlers BEFORE the socket connects
      // (socket.io queues them and calls them once connected)

      socket.on('connect', () => {
        if (destroyed) return;
        console.log(`[Meeting] Socket connected: ${socket.id}`);
        setIsSocketConnected(true);
        socket.emit(MeetingSocketEvents.JOIN_MEETING, meetingId);
        console.log(`[Meeting] Emitted JOIN_MEETING for room ${meetingId}`);
      });

      socket.on('disconnect', (reason) => {
        console.log(`[Meeting] Socket disconnected: ${reason}`);
        setIsSocketConnected(false);
      });

      socket.on('connect_error', (err) => {
        console.error(`[Meeting] Socket connect_error: ${err.message}`, err);
      });

      // ─── USER_JOINED_MEETING ────────────────────────────────────────────────
      socket.on(MeetingSocketEvents.USER_JOINED_MEETING, async (payload: {
        userId: string;
        socketId: string;
        meetingId: string;
        // Updated backend sends {socketId, userId}[]; older backend sent string[].
        // We handle both for backward compatibility.
        existingParticipants: Array<ExistingParticipant | string>;
      }) => {
        if (destroyed) return;
        console.log(
          `[Meeting] USER_JOINED_MEETING: socketId=${payload.socketId} userId=${payload.userId}`,
          `existing=${JSON.stringify(payload.existingParticipants)}`,
        );

        const { userId: joinedUserId, socketId: joinedSocketId, existingParticipants } = payload;

        if (!joinedSocketId) {
          console.error('[Meeting] Missing socketId in USER_JOINED_MEETING payload!');
          return;
        }

        const mySocketId = socket.id;

        if (joinedSocketId === mySocketId) {
          // I just joined — normalise the existing participants list and initiate connections
          const normalised: ExistingParticipant[] = existingParticipants.map(p =>
            typeof p === 'string' ? { socketId: p, userId: '' } : p,
          );

          console.log(
            `[Meeting] I joined. Initiating offers to ${normalised.length} existing participant(s).`,
          );

          for (const existing of normalised) {
            const { socketId: existingSocketId, userId: existingUserId } = existing;

            setParticipants(prev =>
              prev.includes(existingSocketId) ? prev : [...prev, existingSocketId],
            );
            // Set the userId mapping immediately so names resolve without waiting for the answer
            if (existingUserId) {
              setParticipantUserIds(prev => ({ ...prev, [existingSocketId]: existingUserId }));
            }

            try {
              const pc = createPeerConnection(existingSocketId);
              const offer = await pc.createOffer();
              await pc.setLocalDescription(offer);
              socket.emit(MeetingSocketEvents.WEBRTC_OFFER, {
                targetSocketId: existingSocketId,
                meetingId,
                sdp: offer,
              });
              console.log(`[Meeting] Sent offer to ${existingSocketId}`);
            } catch (e) {
              console.error(`[Meeting] Failed to create offer for ${existingSocketId}`, e);
            }
          }
        } else {
          // Someone else joined — add them to our participant list
          console.log(`[Meeting] New participant joined: ${joinedSocketId} (user: ${joinedUserId})`);
          setParticipants(prev =>
            prev.includes(joinedSocketId) ? prev : [...prev, joinedSocketId],
          );
          setParticipantUserIds(prev => ({ ...prev, [joinedSocketId]: joinedUserId }));
        }
      });

      // ─── USER_LEFT_MEETING ──────────────────────────────────────────────────
      socket.on(MeetingSocketEvents.USER_LEFT_MEETING, ({ socketId: leftId }: { socketId: string }) => {
        if (destroyed) return;
        console.log(`[Meeting] USER_LEFT_MEETING: ${leftId}`);
        setParticipants(prev => prev.filter(id => id !== leftId));
        setRemoteStreams(prev => { const n = { ...prev }; delete n[leftId]; return n; });
        setParticipantUserIds(prev => { const n = { ...prev }; delete n[leftId]; return n; });
        setRemoteScreenSharers(prev => { const n = { ...prev }; delete n[leftId]; return n; });
        peerConnections.current[leftId]?.close();
        delete peerConnections.current[leftId];
        delete pendingCandidatesRef.current[leftId];
      });

      // ─── WEBRTC_OFFER ───────────────────────────────────────────────────────
      socket.on(MeetingSocketEvents.WEBRTC_OFFER, async ({
        fromSocketId, fromUserId, sdp
      }: { fromSocketId: string; fromUserId: string; sdp: RTCSessionDescriptionInit }) => {
        if (destroyed) return;
        console.log(`[Meeting] WEBRTC_OFFER from ${fromSocketId}`);
        setParticipants(prev => prev.includes(fromSocketId) ? prev : [...prev, fromSocketId]);
        setParticipantUserIds(prev => ({ ...prev, [fromSocketId]: fromUserId }));
        try {
          const pc = createPeerConnection(fromSocketId);
          await pc.setRemoteDescription(new RTCSessionDescription(sdp));
          // Apply any ICE candidates that arrived before this offer was processed
          await applyPendingCandidates(fromSocketId, pc);
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit(MeetingSocketEvents.WEBRTC_ANSWER, {
            targetSocketId: fromSocketId,
            meetingId,
            sdp: answer,
          });
          console.log(`[Meeting] Sent answer to ${fromSocketId}`);
        } catch (e) {
          console.error('[Meeting] Error handling offer', e);
        }
      });

      // ─── WEBRTC_ANSWER ──────────────────────────────────────────────────────
      socket.on(MeetingSocketEvents.WEBRTC_ANSWER, async ({
        fromSocketId, fromUserId, sdp
      }: { fromSocketId: string; fromUserId: string; sdp: RTCSessionDescriptionInit }) => {
        if (destroyed) return;
        console.log(`[Meeting] WEBRTC_ANSWER from ${fromSocketId}`);
        setParticipantUserIds(prev => ({ ...prev, [fromSocketId]: fromUserId }));
        const pc = peerConnections.current[fromSocketId];
        if (pc && pc.signalingState !== 'stable') {
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(sdp));
            // Apply any ICE candidates that arrived before the answer was processed
            await applyPendingCandidates(fromSocketId, pc);
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
        if (pc && pc.remoteDescription) {
          // Remote description is ready – apply the candidate immediately
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (e) {
            console.error('[Meeting] Error adding ICE candidate', e);
          }
        } else {
          // Queue the candidate to be applied after setRemoteDescription
          if (!pendingCandidatesRef.current[fromSocketId]) {
            pendingCandidatesRef.current[fromSocketId] = [];
          }
          pendingCandidatesRef.current[fromSocketId].push(candidate);
          console.log(`[Meeting] Queued ICE candidate from ${fromSocketId} (remote desc not yet set)`);
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
      // ── Stop sharing ──
      screenStreamRef.current.getTracks().forEach(t => t.stop());
      screenStreamRef.current = null;          // keep ref in sync
      setScreenStream(null);
      setIsScreenSharing(false);
      // Restore the camera video track for all peers
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
      screenStreamRef.current = display;       // keep ref in sync so stop-button works
      setScreenStream(display);
      setIsScreenSharing(true);
      // Replace camera track with screen track for all existing peers
      Object.values(peerConnections.current).forEach(pc => {
        pc.getSenders().find(s => s.track?.kind === 'video')?.replaceTrack(screenTrack);
      });
      // Handle user stopping share via browser's native "Stop sharing" button
      screenTrack.onended = () => {
        screenStreamRef.current = null;
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
