// src/components/employees/chats/CreateGroupModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { X, Search, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AvatarCircle } from "./AvatarCircle";
import { AnimatePresence, motion } from "framer-motion";
import { chatService } from "@/services/employee/chat/chat.service";
import { ConversationType } from "@/shared/types/chat/chat.types";
import { useChatStore } from "@/store/chat.store";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateGroupModal({ isOpen, onClose }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { setConversations, conversations } = useChatStore();

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  // Search employees
  useEffect(() => {
    if (!isOpen) return;

    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const data = await chatService.searchEmployees(search);
        setEmployees(data);
      } catch (error) {
        console.error("Failed to fetch employees", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchEmployees, 300);
    return () => clearTimeout(timer);
  }, [search, isOpen]);

  const canCreate = groupName.trim().length > 0 && selected.length >= 2;

  const handleCreate = async () => {
    if (!canCreate) return;
    
    try {
      const newConv = await chatService.createConversation({
        type: ConversationType.GROUP,
        participants: selected,
        name: groupName
      });
      setConversations([newConv, ...conversations]);
      handleClose();
    } catch (error) {
      console.error("Failed to create group", error);
    }
  };

  const handleClose = () => {
    setGroupName("");
    setSearch("");
    setSelected([]);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 theme-employee">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Panel */}
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 12 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-[rgb(var(--color-surface))] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
              <div>
                <h2 className="text-base font-black text-white uppercase tracking-widest">Create Group</h2>
                <p className="text-xs text-slate-500 mt-0.5">Add at least 2 members to start</p>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Group Name */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 block">
                  Group Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Project Phoenix"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className={cn(
                    "w-full px-4 py-3 rounded-xl text-sm text-white",
                    "bg-white/[0.04] border border-white/[0.08]",
                    "placeholder:text-slate-600 focus:outline-none focus:border-accent/40 transition-all"
                  )}
                />
              </div>

              {/* Members Search */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 block">
                  Add Members ({selected.length} selected)
                </label>
                <div className="relative mb-3">
                  <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input
                    type="text"
                    placeholder="Search teammates..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={cn(
                      "w-full pl-9 pr-4 py-2.5 rounded-xl text-xs text-white",
                      "bg-white/[0.04] border border-white/[0.08]",
                      "placeholder:text-slate-600 focus:outline-none focus:border-accent/40 transition-all"
                    )}
                  />
                  {isLoading && (
                    <Loader2 size={12} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-accent animate-spin" />
                  )}
                </div>

                <div className="space-y-1 max-h-[220px] overflow-y-auto [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.08)_transparent] pr-1">
                  {employees.map((emp) => {
                    const isChecked = selected.includes(emp.id);
                    const name = emp.name;
                    return (
                      <button
                        key={emp.id}
                        onClick={() => toggle(emp.id)}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all",
                          isChecked ? "bg-accent/10 border border-accent/20" : "hover:bg-white/[0.04] border border-transparent"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <AvatarCircle name={name} size={32} />
                          <div className="text-left">
                            <p className="text-xs font-bold text-white">{name}</p>
                            <p className="text-[10px] text-slate-500">{emp.email}</p>
                          </div>
                        </div>
                        <div className={cn(
                          "w-5 h-5 rounded-md border flex items-center justify-center transition-all",
                          isChecked ? "bg-accent border-accent text-[#061218]" : "border-white/[0.12] text-transparent"
                        )}>
                          <Check size={11} strokeWidth={3} />
                        </div>
                      </button>
                    );
                  })}
                  {!isLoading && employees.length === 0 && search && (
                    <p className="text-center py-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">No results</p>
                  )}
                </div>
              </div>

              {/* Create Button */}
              <button
                disabled={!canCreate}
                onClick={handleCreate}
                className={cn(
                  "w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all",
                  canCreate
                    ? "bg-accent text-[#061218] shadow-[0_0_24px_rgba(45,212,191,0.25)] hover:shadow-[0_0_32px_rgba(45,212,191,0.45)] active:scale-[0.98]"
                    : "bg-white/[0.04] text-slate-600 cursor-not-allowed border border-white/[0.06]"
                )}
              >
                Create Group
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
