"use client";

import React, { useEffect, useState, use } from "react";
import MeetingRoom from "@/components/ui/meeting/MeetingRoom";
import { getMeetingByIdAction } from "@/actions/meeting/meeting.actions";
import { Meeting } from "@/shared/types/company/meeting.type";
import { Loader2 } from "lucide-react";

export default function AdminMeetingRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeeting = async () => {
      const result = await getMeetingByIdAction(resolvedParams.id);
      if (result.success && result.data) {
        setMeeting(result.data);
      }
      setLoading(false);
    };
    fetchMeeting();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#0a0b0d]">
        <Loader2 className="animate-spin text-indigo-500 mb-4" size={32} />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          Joining Session...
        </p>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#0a0b0d]">
        <h1 className="text-xl font-black text-white uppercase tracking-widest mb-2">Not Found</h1>
        <p className="text-xs text-slate-400">The meeting you are trying to join does not exist.</p>
      </div>
    );
  }

  if (meeting.status === 'ENDED') {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#0a0b0d]">
        <h1 className="text-xl font-black text-rose-500 uppercase tracking-widest mb-2">Meeting Ended</h1>
        <p className="text-xs text-slate-400">This meeting has already been ended.</p>
      </div>
    );
  }

  return <MeetingRoom meeting={meeting} />;
}
