"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, Check, Clock, Briefcase, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { useNotificationStore } from "@/store/notification.store";
import { useAuthStore } from "@/store/auth.store";
import { useProfileStore } from "@/store/profile.store";
import { Notification, NotificationType } from "@/shared/types/notification.type";
import { cn } from "@/lib/utils";

// Format date to "2 hours ago", etc.
const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case NotificationType.PROJECT_ASSIGNED:
      return <Briefcase size={16} className="text-blue-400" />;
    case NotificationType.TASK_ASSIGNED:
      return <CheckCircle2 size={16} className="text-emerald-400" />;
    case NotificationType.STORY_ASSIGNED:
      return <FileText size={16} className="text-purple-400" />;
    default:
      return <AlertCircle size={16} className="text-amber-400" />;
  }
};

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { accessToken } = useAuthStore();
  const { userProfile } = useProfileStore();
  const { notifications, unreadCount, markAsRead, fetchNotifications, connectSocket, disconnectSocket } = useNotificationStore();

  useEffect(() => {
    if (accessToken && userProfile?.id) {
      fetchNotifications();
      connectSocket(accessToken, userProfile.id);

      return () => {
        disconnectSocket();
      };
    }
  }, [accessToken, userProfile?.id, fetchNotifications, connectSocket, disconnectSocket]);

  // Handle outside click to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className={cn(
          "p-2 transition-colors relative rounded-full select-none outline-none focus:outline-none",
          isOpen ? "bg-white/10 text-white" : "text-muted hover:text-accent hover:bg-white/5"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell size={20} strokeWidth={1.5} />
        
        {/* 🔥 HIGH VISIBILITY CRIMSON RED ACCENT NOTIFICATION BADGE CARD */}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 z-10 pointer-events-none">
            {/* Ambient Pulse Ring Overlay */}
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            
            {/* Core Counter Shield Badge */}
            <span className="relative inline-flex rounded-full h-4 w-4 bg-gradient-to-b from-red-500 to-red-600 text-[9px] font-black text-white items-center justify-center shadow-md shadow-red-950/40 border border-[#0d0f12] tracking-tighter tabular-nums">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          </span>
        )}
      </button>

      {isOpen && (
        /* Overhauled dropdown viewport layer backdrop filter to guarantee crisp visibility */
        <div className="absolute right-0 mt-2 w-80 md:w-96 flex flex-col rounded-2xl border border-white/[0.08] bg-slate-950/80 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Header Bar Area Panel */}
          <div className="flex items-center justify-between p-4 border-b border-white/[0.06] bg-transparent">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Notifications
              {unreadCount > 0 && (
                <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] py-0.5 px-2 rounded-full font-black">
                  {unreadCount} New
                </span>
              )}
            </h3>
            <button 
              type="button"
              className="text-[10px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer hover:text-white transition-colors outline-none"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </div>

          {/* List Scroll Matrix Wrapper */}
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-slate-600 mb-3">
                  <Bell size={20} strokeWidth={1.5} />
                </div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">All caught up</p>
                <p className="text-[11px] text-slate-500 mt-1 max-w-[200px] leading-normal">We'll alert you when a task or project context modifies.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.05]">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={cn(
                      "p-4 flex gap-4 cursor-pointer transition-colors duration-200 group relative",
                      notification.isRead 
                        ? "bg-transparent hover:bg-white/[0.02]" 
                        : "bg-white/[0.01] hover:bg-white/[0.03]"
                    )}
                  >
                    {/* Circle icon frame design layout parameters */}
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border transition-all duration-200",
                      notification.isRead 
                        ? "bg-white/[0.02] border-white/[0.04]" 
                        : "bg-white/[0.05] border-white/[0.1] shadow-[0_0_15px_rgba(255,255,255,0.02)]"
                    )}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <p className={cn(
                          "text-[13px] leading-snug flex-1 break-words",
                          notification.isRead ? "text-slate-400 font-normal" : "text-slate-100 font-medium"
                        )}>
                          {notification.message}
                        </p>
                        
                        {/* Dynamic Live Unread Anchor Dot indicator */}
                        {!notification.isRead && (
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5 shadow-[0_0_8px_#ef4444]" />
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-slate-500">
                        <Clock size={10} />
                        <span>{timeAgo(notification.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};