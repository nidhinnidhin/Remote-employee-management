"use client";

import React, { useState } from "react";
import BaseModal from "@/components/ui/BaseModal";
import Button from "@/components/ui/Button";
import { Employee } from "@/shared/types/company/employees/employee-listing.type";
import { toast } from "sonner";
import { createInstantMeetingAction } from "@/actions/meeting/meeting.actions";
import { useRouter } from "next/navigation";
import { Video } from "lucide-react";

interface InstantMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
}

export default function InstantMeetingModal({ isOpen, onClose, employees }: InstantMeetingModalProps) {
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleEmployee = (id: string) => {
    setSelectedEmployees(prev => 
      prev.includes(id) ? prev.filter(eId => eId !== id) : [...prev, id]
    );
  };

  const handleStart = async () => {
    if (selectedEmployees.length === 0) {
      toast.error("Please select at least one participant.");
      return;
    }

    setLoading(true);
    const result = await createInstantMeetingAction({ participants: selectedEmployees });
    
    if (result.success && result.data) {
      toast.success("Instant meeting created!");
      onClose();
      // Redirect to meeting room
      router.push(`/company-admin/discussions/${result.data.id}`);
    } else {
      toast.error(result.error || "Failed to create meeting.");
    }
    setLoading(false);
  };

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Instant Meeting"
      description="Start a live session"
      theme="theme-company"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleStart} isLoading={loading} className="bg-orange-500 hover:bg-orange-600 text-white border-0">
            Start Meeting
          </Button>
        </div>
      }
    >
      <div className="mt-2">
        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 block text-left">
          Select Participants
        </label>
        <div className="max-h-60 overflow-y-auto pr-2 space-y-2 text-left">
          {employees.map(employee => (
            <label 
              key={employee.id} 
              className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.05] bg-white/[0.02] cursor-pointer hover:bg-white/[0.05] transition-colors"
            >
              <input 
                type="checkbox"
                checked={selectedEmployees.includes(employee.id)}
                onChange={() => toggleEmployee(employee.id)}
                className="w-4 h-4 rounded border-white/20 bg-black/50 text-orange-500 focus:ring-orange-500"
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">{employee.name}</span>
                <span className="text-[10px] text-slate-500">{employee.email}</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </BaseModal>
  );
}
