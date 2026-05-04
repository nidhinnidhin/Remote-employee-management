// src/components/employees/chats/GroupDetailModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { X, Search, Check, Loader2, UserMinus, Shield, ShieldCheck, Edit2, Save, UserPlus, Camera, Trash2, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { AvatarCircle } from "./AvatarCircle";
import { AnimatePresence, motion } from "framer-motion";
import { chatService } from "@/services/employee/chat/chat.service";
import { Conversation } from "@/shared/types/chat/chat.types";
import { useAuthStore } from "@/store/auth.store";

interface GroupDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: Conversation;
}

export function GroupDetailModal({ isOpen, onClose, conversation }: GroupDetailModalProps) {
  const { userId } = useAuthStore();
  const isAdmin = userId && conversation.admins.includes(userId);
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(conversation.name || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setNewName(conversation.name || "");
  }, [conversation.name]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !isAdmin) return;
    setIsUploading(true);
    try {
      const response = await chatService.uploadGroupImage(file) as any;
      await chatService.updateConversation(conversation.id, { avatar: response.imageUrl });
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (isAddingMember) {
      const fetchEmployees = async () => {
        setIsLoading(true);
        try {
          const data = await chatService.searchEmployees(search);
          // Filter out existing participants
          setSearchResults(data.filter(emp => !conversation.participants.includes(emp.id)));
        } catch (error) {
          console.error("Search failed", error);
        } finally {
          setIsLoading(false);
        }
      };
      const timer = setTimeout(fetchEmployees, 300);
      return () => clearTimeout(timer);
    }
  }, [search, isAddingMember, conversation.participants]);

  const handleRename = async () => {
    if (!newName.trim() || newName === conversation.name) {
      setIsEditingName(false);
      return;
    }
    try {
      await chatService.updateConversation(conversation.id, { name: newName });
      setIsEditingName(false);
    } catch (error) {
      console.error("Rename failed", error);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!isAdmin) return;
    try {
      const newParticipants = conversation.participants.filter(id => id !== memberId);
      const newAdmins = conversation.admins.filter(id => id !== memberId);
      await chatService.updateConversation(conversation.id, { 
        participants: newParticipants,
        admins: newAdmins
      });
    } catch (error) {
      console.error("Remove failed", error);
    }
  };

  const handleAddMember = async (memberId: string) => {
    if (!isAdmin) return;
    try {
      const newParticipants = [...conversation.participants, memberId];
      await chatService.updateConversation(conversation.id, { participants: newParticipants });
      setIsAddingMember(false);
      setSearch("");
    } catch (error) {
      console.error("Add failed", error);
    }
  };

  const handleToggleAdmin = async (memberId: string) => {
    if (!isAdmin) return;
    try {
      let newAdmins;
      if (conversation.admins.includes(memberId)) {
        // Prevent removing the last admin (though creator is always admin)
        if (conversation.admins.length === 1) return;
        newAdmins = conversation.admins.filter(id => id !== memberId);
      } else {
        newAdmins = [...conversation.admins, memberId];
      }
      await chatService.updateConversation(conversation.id, { admins: newAdmins });
    } catch (error) {
      console.error("Toggle admin failed", error);
    }
  };

  const handleLeave = async () => {
    if (!window.confirm("Are you sure you want to leave this group?")) return;
    try {
      await chatService.leaveConversation(conversation.id);
      onClose();
    } catch (error) {
      console.error("Leave failed", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this group? This cannot be undone.")) return;
    try {
      await chatService.deleteConversation(conversation.id);
      onClose();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 theme-employee">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 12 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-[rgb(var(--color-surface))] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header / Group Icon & Name */}
            <div className="p-8 border-b border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent text-center">
              <div className="relative inline-block mb-4">
                <div className="relative group/avatar cursor-pointer">
                  <div className="w-20 h-20 rounded-3xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-3xl font-black shadow-[0_0_30px_rgba(45,212,191,0.15)] mx-auto overflow-hidden">
                    {conversation.avatar ? (
                      <img src={conversation.avatar} className="w-full h-full object-cover" />
                    ) : (
                      conversation.name?.[0].toUpperCase() || "G"
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Loader2 size={24} className="text-accent animate-spin" />
                      </div>
                    )}
                    {isAdmin && !isUploading && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-all">
                        <Camera size={20} className="text-white" />
                      </div>
                    )}
                  </div>
                  {isAdmin && (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                  )}
                </div>
                {isAdmin && (
                  <button 
                    onClick={() => setIsEditingName(!isEditingName)}
                    className="absolute -right-2 -bottom-2 w-8 h-8 rounded-full bg-[rgb(var(--color-surface))] border border-white/[0.1] flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-xl z-20"
                  >
                    <Edit2 size={12} />
                  </button>
                )}
              </div>

              {isEditingName ? (
                <div className="flex items-center gap-2 max-w-[240px] mx-auto">
                  <input
                    autoFocus
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="flex-1 bg-white/[0.05] border border-accent/30 rounded-lg px-3 py-1.5 text-sm text-white text-center focus:outline-none"
                  />
                  <button onClick={handleRename} className="text-accent hover:scale-110 transition-all">
                    <Save size={16} />
                  </button>
                </div>
              ) : (
                <h2 className="text-xl font-black text-white uppercase tracking-wider">{conversation.name || "Group Chat"}</h2>
              )}
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">
                {conversation.participants.length} Members
              </p>
            </div>

            {/* Content */}
            <div className="max-h-[400px] overflow-y-auto p-4 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.08)_transparent]">
              {/* Add Member Section */}
              {isAdmin && (
                <div className="mb-6">
                   <button 
                    onClick={() => setIsAddingMember(!isAddingMember)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-white/[0.1] text-slate-400 hover:text-accent hover:border-accent/30 hover:bg-accent/5 transition-all text-[10px] font-black uppercase tracking-widest"
                   >
                    <UserPlus size={14} />
                    {isAddingMember ? "Close Search" : "Add New Member"}
                   </button>

                   <AnimatePresence>
                    {isAddingMember && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mt-3"
                      >
                         <div className="relative mb-3">
                          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input
                            autoFocus
                            type="text"
                            placeholder="Find teammate..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-8 pr-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-accent/30"
                          />
                          {isLoading && <Loader2 size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-accent animate-spin" />}
                         </div>
                         <div className="space-y-1">
                            {searchResults.map(emp => (
                              <button
                                key={emp.id}
                                onClick={() => handleAddMember(emp.id)}
                                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.04] group transition-all"
                              >
                                <div className="flex items-center gap-2">
                                  <AvatarCircle name={emp.name} size={24} />
                                  <span className="text-xs text-slate-300 font-medium">{emp.name}</span>
                                </div>
                                <Plus size={12} className="text-slate-600 group-hover:text-accent" />
                              </button>
                            ))}
                         </div>
                      </motion.div>
                    )}
                   </AnimatePresence>
                </div>
              )}

              {/* Members List */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 px-2 mb-2 block">Members</label>
                {conversation.participantDetails?.map((member) => {
                  const isMemberAdmin = conversation.admins.includes(member.id);
                  const isMe = userId === member.id;

                  return (
                    <div
                      key={member.id}
                      className="group flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.02] transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <AvatarCircle name={member.name} avatar={member.avatar} size={36} />
                          {isMemberAdmin && (
                            <div className="absolute -right-1 -top-1 w-4 h-4 rounded-full bg-[#061218] flex items-center justify-center text-accent shadow-lg border border-accent/20">
                              <ShieldCheck size={10} strokeWidth={3} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white flex items-center gap-2">
                            {member.name}
                            {isMe && <span className="px-1.5 py-0.5 rounded-[4px] bg-white/[0.05] text-[8px] text-slate-500 font-black uppercase tracking-tighter">You</span>}
                          </p>
                          <p className="text-[9px] text-slate-500">{isMemberAdmin ? "Group Admin" : "Member"}</p>
                        </div>
                      </div>

                      {isAdmin && !isMe && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          <button
                            onClick={() => handleToggleAdmin(member.id)}
                            title={isMemberAdmin ? "Remove Admin" : "Make Admin"}
                            className={cn(
                              "w-7 h-7 rounded-lg flex items-center justify-center transition-all",
                              isMemberAdmin ? "text-accent bg-accent/10" : "text-slate-500 hover:text-white hover:bg-white/5"
                            )}
                          >
                            <Shield size={14} />
                          </button>
                          <button
                            onClick={() => handleRemoveMember(member.id)}
                            title="Remove from group"
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                          >
                            <UserMinus size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLeave}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 transition-all"
                >
                  <LogOut size={14} />
                  Leave Group
                </button>
                {isAdmin && (
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                )}
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] bg-white/[0.05] text-white hover:bg-white/[0.08] transition-all"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

import { Plus } from "lucide-react";
