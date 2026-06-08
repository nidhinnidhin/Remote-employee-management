"use client";

import React, { useEffect, useState } from "react";
import { Video, CalendarClock, Hash } from "lucide-react";
import { getMeetingsAction } from "@/actions/meeting/meeting.actions";
import { Meeting } from "@/shared/types/company/meeting.type";
import Button from "@/components/ui/Button";
import Pagination from "@/components/ui/Pagination"; 
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function EmployeeDiscussionsClient() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const LIMIT = 9;
  const router = useRouter();

  const fetchMeetings = async (page: number) => {
    setLoading(true);
    try {
      const result = await getMeetingsAction(page, LIMIT);
      
      if (result.success && result.data) {
        // Safe Extraction: Aligns array data maps across identical logic wrappers
        if (result.data.meetings && Array.isArray(result.data.meetings)) {
          setMeetings(result.data.meetings);
        } else if (Array.isArray(result.data)) {
          setMeetings(result.data);
        } else {
          setMeetings([]);
        }
        
        if (result.data.meta) {
          setTotalPages(result.data.meta.totalPages || 1);
          setCurrentPage(result.data.meta.page || 1);
        } else {
          setTotalPages(1);
        }
      } else {
        setMeetings([]);
      }
    } catch (err) {
      console.error("Frontend employee meeting parsing crash:", err);
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleJoin = (id: string) => {
    router.push(`/employee/discussions/${id}`); 
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 h-full">
        <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
          Loading Meetings...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 animate-in fade-in duration-700 h-full overflow-y-auto justify-between">
      <div className="flex flex-col gap-6 w-full">
        <div className="flex items-center justify-between border-b border-white/[0.05] pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
              <Video size={20} />
            </div>
            <div>
              <h1 className="text-lg font-black text-white uppercase tracking-widest">
                Available Discussions
              </h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                Join your team sessions
              </p>
            </div>
          </div>
        </div>

        {meetings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/[0.01] border border-dashed border-white/[0.05] rounded-3xl mt-10">
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500/50 mb-4">
              <Video size={24} />
            </div>
            <h2 className="text-sm font-black text-white uppercase tracking-widest">
              No Meetings Scheduled
            </h2>
            <p className="text-xs text-slate-500 mt-2">
              You will see active or scheduled team discussions here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {meetings.map((meeting) => (
              <div
                key={meeting.id}
                className="group relative bg-[#0a0c10] border border-white/[0.05] rounded-2xl p-6 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={cn(
                      "px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border",
                      meeting.status === "ONGOING"
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : meeting.status === "SCHEDULED"
                          ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          : "bg-slate-500/10 text-slate-500 border-slate-500/20",
                    )}
                  >
                    {meeting.status}
                  </div>
                  {meeting.type === "INSTANT" ? (
                    <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                      <Video size={16} />
                    </div>
                  ) : (
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                      <CalendarClock size={16} />
                    </div>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white mb-2">
                  {meeting.type === "INSTANT"
                    ? "Instant Session"
                    : "Scheduled Meeting"}
                </h3>

                <div className="flex flex-col gap-2 mb-6 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Hash size={14} className="text-slate-500" />
                    <span>{meeting.id.slice(-8)}</span>
                  </div>
                  {meeting.scheduledAt && (
                    <div className="flex items-center gap-2">
                      <CalendarClock size={14} className="text-blue-500/50" />
                      <span>
                        {new Date(meeting.scheduledAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => handleJoin(meeting.id)}
                  disabled={
                    meeting.status === "ENDED" || meeting.status === "CANCELLED"
                  }
                  className={cn(
                    "w-full rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
                    meeting.status === "ONGOING"
                      ? "bg-emerald-500 hover:bg-emerald-600 text-black shadow-lg shadow-emerald-500/20"
                      : meeting.status === "SCHEDULED"
                        ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                        : "bg-white/5 text-slate-500 cursor-not-allowed",
                  )}
                >
                  {meeting.status === "ENDED" ? "Ended" : "Join Meeting"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Render Pagination controls cleanly at the bottom */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center mt-8 pt-5 border-t border-white/[0.05] w-full">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            theme="dark"
          />
        </div>
      )}
    </div>
  );
}