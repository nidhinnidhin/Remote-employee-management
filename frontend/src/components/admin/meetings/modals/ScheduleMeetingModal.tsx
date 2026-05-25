"use client";

import React, { useState } from "react";
import BaseModal from "@/components/ui/BaseModal";
import Button from "@/components/ui/Button";
import { Employee } from "@/shared/types/company/employees/employee-listing.type";
import { toast } from "sonner";
import { scheduleMeetingAction } from "@/actions/meeting/meeting.actions";

interface ScheduleMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
}

export default function ScheduleMeetingModal({ isOpen, onClose, employees }: ScheduleMeetingModalProps) {
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleEmployee = (id: string) => {
    setSelectedEmployees(prev => 
      prev.includes(id) ? prev.filter(eId => eId !== id) : [...prev, id]
    );
  };

  const handleSchedule = async () => {
    if (selectedEmployees.length === 0) {
      toast.error("Please select at least one participant.");
      return;
    }
    if (!date || !time) {
      toast.error("Please select a valid date and time.");
      return;
    }

    setLoading(true);
    
    // Combine date and time
    const scheduledAt = new Date(`${date}T${time}`).toISOString();

    const result = await scheduleMeetingAction({ participants: selectedEmployees, scheduledAt });
    
    if (result.success && result.data) {
      toast.success("Meeting scheduled successfully!");
      onClose();
    } else {
      toast.error(result.error || "Failed to schedule meeting.");
    }
    setLoading(false);
  };

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Schedule Meeting"
      description="Plan ahead"
      theme="theme-company"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSchedule} isLoading={loading} className="bg-blue-500 hover:bg-blue-600 text-white border-0">
            Schedule
          </Button>
        </div>
      }
    >
      <div className="mt-2 flex flex-col gap-5 text-left">
        <div className="flex gap-4 text-left">
          <div className="flex-1">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
              Date
            </label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 h-10 text-sm text-white focus:outline-none focus:border-blue-500/40"
            />
          </div>
          <div className="flex-1">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
              Time
            </label>
            <input 
              type="time" 
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 h-10 text-sm text-white focus:outline-none focus:border-blue-500/40"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 block">
            Participants
          </label>
          <div className="max-h-40 overflow-y-auto pr-2 space-y-2">
            {employees.map(employee => (
              <label 
                key={employee.id} 
                className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.05] bg-white/[0.02] cursor-pointer hover:bg-white/[0.05] transition-colors"
              >
                <input 
                  type="checkbox"
                  checked={selectedEmployees.includes(employee.id)}
                  onChange={() => toggleEmployee(employee.id)}
                  className="w-4 h-4 rounded border-white/20 bg-black/50 text-blue-500 focus:ring-blue-500"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">{employee.name}</span>
                  <span className="text-[10px] text-slate-500">{employee.email}</span>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
