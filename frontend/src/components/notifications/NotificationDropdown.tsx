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
    // Depending on the notification type, we might want to navigate to the specific entity
    // e.g. router.push(`/employee/projects/${notification.projectId}`)
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className={cn(
          "p-2 transition-colors relative rounded-full",
          isOpen ? "bg-white/10 text-white" : "text-muted hover:text-accent hover:bg-white/5"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell size={20} strokeWidth={1.5} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[14px] h-[14px] flex items-center justify-center bg-danger rounded-full border-2 border-bg text-[8px] font-bold text-white px-0.5">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-[#1a1b1e]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.02]">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Notifications
              {unreadCount > 0 && (
                <span className="bg-accent/20 text-accent text-[10px] py-0.5 px-2 rounded-full font-black">
                  {unreadCount} New
                </span>
              )}
            </h3>
            <div className="text-[10px] text-muted font-medium uppercase tracking-widest cursor-pointer hover:text-white transition-colors"
                 onClick={() => {
                   // Mark all as read logic could be added here
                   // For now, let's just close the dropdown
                   setIsOpen(false);
                 }}>
              Close
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <Bell size={32} strokeWidth={1} className="text-slate-600 mb-3" />
                <p className="text-sm text-slate-300 font-medium">No notifications yet</p>
                <p className="text-xs text-slate-500 mt-1">We'll let you know when something comes up.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={cn(
                      "p-4 flex gap-4 cursor-pointer transition-colors duration-200 group",
                      notification.isRead 
                        ? "bg-transparent hover:bg-white/[0.02]" 
                        : "bg-accent/[0.03] hover:bg-accent/[0.06]"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border",
                      notification.isRead ? "bg-bg border-white/5" : "bg-bg border-accent/20 shadow-[0_0_15px_rgba(var(--accent),0.15)]"
                    )}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className={cn(
                          "text-[13px] leading-tight flex-1",
                          notification.isRead ? "text-slate-300" : "text-white font-medium"
                        )}>
                          {notification.message}
                        </p>
                        {!notification.isRead && (
                          <div className="w-2 h-2 rounded-full bg-accent shrink-0 mt-1 shadow-[0_0_8px_rgba(var(--accent),0.5)]" />
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
