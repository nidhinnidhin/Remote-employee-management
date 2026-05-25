"use client";

import React, { useEffect, useRef } from "react";
import { useMeeting } from "@/hooks/meeting/useMeeting";
import { Mic, MicOff, Video, VideoOff, MonitorUp, PhoneOff, UserX } from "lucide-react";
import Button from "@/components/ui/Button";
import { Meeting } from "@/shared/types/company/meeting.type";
import { useAuthStore } from "@/store/auth.store";
import { useProfileStore } from "@/store/profile.store";
import { cn } from "@/lib/utils";

interface MeetingRoomProps {
  meeting: Meeting;
}

interface VideoPlayerProps {
  stream: MediaStream | null;
  isLocal?: boolean;
  name: string;
  isMuted?: boolean;
  isScreenShare?: boolean;
}

const VideoPlayer = ({ stream, isLocal, name, isMuted, isScreenShare }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className={cn(
      "relative bg-[#08090a] rounded-2xl overflow-hidden border border-white/5 group w-full flex flex-col justify-center items-center shadow-md",
      isScreenShare ? "h-full min-h-[300px]" : "aspect-video"
    )}>
      {stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className={cn(
            "w-full h-full", 
            isScreenShare ? "object-contain" : "object-cover",
            isLocal && !isScreenShare && "scale-x-[-1]"
          )}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/[0.02]">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/[0.05] flex items-center justify-center text-slate-500 text-lg md:text-xl font-bold uppercase mb-2 md:mb-4">
            {name.charAt(0)}
          </div>
          <p className="text-xs md:text-sm font-semibold text-slate-400 px-2 text-center truncate max-w-full">{name}</p>
        </div>
      )}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <span className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-black text-white uppercase tracking-wider shadow-lg">
          {name} {isLocal && !isScreenShare && "(You)"}
        </span>
        {isMuted && (
          <div className="bg-rose-500/80 backdrop-blur-md p-1.5 rounded-lg text-white shadow-lg">
            <MicOff size={14} />
          </div>
        )}
      </div>
    </div>
  );
};

export default function MeetingRoom({ meeting }: MeetingRoomProps) {
  const { userId } = useAuthStore();
  const { userProfile } = useProfileStore();
  const {
    localStream,
    remoteStreams,
    participants,
    participantUserIds,
    isMuted,
    isVideoOff,
    screenStream,
    isScreenSharing,
    remoteScreenSharers,
    isSocketConnected,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    muteParticipant,
    kickParticipant,
    eventLog
  } = useMeeting(meeting.id);

  const isCreator = userId === meeting.creatorId;
  const myName = userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : "Me";
  const role = userProfile?.role ?? '';

  const handleLeave = () => {
    window.location.href = role === 'COMPANY_ADMIN' ? '/company-admin/discussions' : '/employee/discussions';
  };

  const remoteScreenSharerId = participants.find(pId => remoteScreenSharers[pId]);
  const hasActiveScreenShare = isScreenSharing || !!remoteScreenSharerId;

  const totalTiles = participants.length + 1;

  // Optimized Layout classes built specifically to preserve aspect ratios safely
  const getGridLayout = () => {
    if (hasActiveScreenShare) {
      return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 max-w-full mx-auto";
    }
    if (totalTiles === 1) {
      return "grid-cols-1 max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto";
    }
    if (totalTiles === 2) {
      return "grid-cols-1 md:grid-cols-2 max-w-2xl md:max-w-5xl lg:max-w-6xl mx-auto";
    }
    if (totalTiles <= 4) {
      return "grid-cols-2 max-w-2xl md:max-w-5xl lg:max-w-6xl mx-auto";
    }
    return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-7xl mx-auto";
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-[#0a0b0d] p-4 md:p-6 animate-in fade-in duration-700 overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 md:p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500">
            <Video size={18} className="md:w-5 md:h-5" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-black text-white uppercase tracking-widest">
              Live Session
            </h1>
            <p className="text-[10px] md:text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-0.5 md:mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {totalTiles} Participants
            </p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-h-0 gap-4 justify-center items-center w-full">
        {/* PINNED SCREEN SHARE AREA */}
        {hasActiveScreenShare && (
          <div className="w-full flex-1 min-h-0 bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
            {isScreenSharing && screenStream ? (
              <VideoPlayer 
                stream={screenStream} 
                name={`Your Screen`} 
                isLocal={true} 
                isScreenShare={true} 
              />
            ) : remoteScreenSharerId && remoteStreams[remoteScreenSharerId] ? (
              <VideoPlayer 
                stream={remoteStreams[remoteScreenSharerId]} 
                name={`${meeting.participantDetails?.find(p => p.id === participantUserIds[remoteScreenSharerId])?.name ?? "Participant"}'s Screen`} 
                isLocal={false} 
                isScreenShare={true}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                Loading screen share...
              </div>
            )}
          </div>
        )}

        {/* PARTICIPANTS GRID */}
        <div className={cn(
          "w-full overflow-y-auto flex items-center justify-center transition-all duration-300",
          hasActiveScreenShare ? "h-auto max-h-[160px] md:max-h-[200px]" : "flex-1"
        )}>
          <div className={cn("grid gap-3 md:gap-4 w-full justify-center items-center", getGridLayout())}>
            {/* Local User */}
            <div className="relative group w-full flex items-center justify-center">
              <VideoPlayer
                stream={isVideoOff ? null : localStream}
                isLocal
                name={myName}
                isMuted={isMuted}
              />
            </div>

            {/* Remote Users */}
            {participants.map(pId => {
              const pUserId = participantUserIds[pId];
              const isThisUserSharing = remoteScreenSharerId === pId;
              const pName = meeting.participantDetails?.find(p => p.id === pUserId)?.name ?? "Participant";
              
              return (
                <div key={pId} className="relative group w-full flex items-center justify-center">
                  <VideoPlayer
                    stream={isThisUserSharing ? null : (remoteStreams[pId] ?? null)}
                    name={isThisUserSharing ? `${pName} (Presenting)` : pName}
                  />
                  {/* Creator controls overlay */}
                  {isCreator && pUserId && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      <button
                        onClick={() => muteParticipant(pUserId)}
                        className="p-1.5 md:p-2 bg-black/60 backdrop-blur-md rounded-lg text-white hover:text-rose-400 hover:bg-black/80 transition-colors"
                        title="Mute Participant"
                      >
                        <MicOff size={13} />
                      </button>
                      <button
                        onClick={() => kickParticipant(pUserId)}
                        className="p-1.5 md:p-2 bg-rose-500/80 backdrop-blur-md rounded-lg text-white hover:bg-rose-600 transition-colors"
                        title="Remove Participant"
                      >
                        <UserX size={13} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CONTROLS BAR */}
      <div className="mt-4 pt-4 border-t border-white/[0.05] flex items-center justify-center gap-3 md:gap-4 shrink-0">
        <Button
          onClick={() => toggleAudio()}
          className={cn(
            "w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all shadow-xl",
            isMuted
              ? "bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20"
              : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
          )}
        >
          {isMuted ? <MicOff className="w-5 h-5 md:w-5.5 md:h-5.5" /> : <Mic className="w-5 h-5 md:w-5.5 md:h-5.5" />}
        </Button>

        <Button
          onClick={toggleVideo}
          className={cn(
            "w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all shadow-xl",
            isVideoOff
              ? "bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20"
              : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
          )}
        >
          {isVideoOff ? <VideoOff className="w-5 h-5 md:w-5.5 md:h-5.5" /> : <Video className="w-5 h-5 md:w-5.5 md:h-5.5" />}
        </Button>

        <Button
          onClick={toggleScreenShare}
          className={cn(
            "w-12 h-12 md:w-14 md:h-14 rounded-2xl transition-all flex items-center justify-center shadow-xl",
            isScreenSharing
              ? "bg-blue-500 text-white shadow-blue-500/20 hover:bg-blue-600"
              : "bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500/20"
          )}
        >
          <MonitorUp className="w-5 h-5 md:w-5.5 md:h-5.5" />
        </Button>

        <Button
          onClick={handleLeave}
          className="h-12 md:h-14 px-6 md:px-8 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black uppercase tracking-widest text-[11px] md:text-xs flex items-center gap-2.5 md:gap-3 shadow-xl shadow-rose-500/20 transition-all ml-2 md:ml-4"
        >
          <PhoneOff className="w-4 h-4 md:w-4.5 md:h-4.5" />
          Leave
        </Button>
      </div>
    </div>
  );
}