import React, { useState } from "react";
import { format } from "date-fns";
import BaseModal from "@/components/ui/BaseModal";
import Button from "@/components/ui/Button";
import { AdminLeaveRequest } from "@/services/company/leave/leave.service";
import { Calendar, Clock, FileText, AlertCircle, Phone, CheckCircle2, XCircle } from "lucide-react";

interface AdminLeaveDetailsModalProps {
  selectedLog: AdminLeaveRequest | null;
  onClose: () => void;
  onDecideRequest: (id: string, status: "APPROVED" | "REJECTED", remarks: string) => Promise<void>;
}

export const AdminLeaveDetailsModal: React.FC<AdminLeaveDetailsModalProps> = ({
  selectedLog,
  onClose,
  onDecideRequest,
}) => {
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [decision, setDecision] = useState<"APPROVED" | "REJECTED" | null>(null);

  if (!selectedLog) return null;

  const handleDecision = async (status: "APPROVED" | "REJECTED") => {
    if (status === "REJECTED" && !remarks.trim()) {
      // Basic validation (form required handles most of this but just in case)
      return;
    }
    
    setLoading(true);
    setDecision(status);
    try {
      await onDecideRequest(selectedLog.id, status, remarks);
      setRemarks("");
      onClose();
    } catch (e) {
      // Error handled by parent
    } finally {
      setLoading(false);
      setDecision(null);
    }
  };

  const isPending = selectedLog.status === "PENDING";

  return (
    <BaseModal
      isOpen={!!selectedLog}
      onClose={onClose}
      title="Leave Request Details"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Employee Info Header */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div className="w-12 h-12 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
            {selectedLog.employeeId?.avatar ? (
              <img src={selectedLog.employeeId.avatar} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-bold text-slate-400">
                {selectedLog.employeeId?.firstName?.[0] || "?"}
                {selectedLog.employeeId?.lastName?.[0] || "?"}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {selectedLog.employeeId?.firstName} {selectedLog.employeeId?.lastName}
            </h3>
            <p className="text-sm text-slate-400">{selectedLog.employeeId?.email}</p>
          </div>
        </div>

        {/* Leave Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Calendar size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Leave Type</span>
            </div>
            <p className="text-sm font-medium text-slate-200 capitalize">
              {selectedLog.leaveType?.replace(/_/g, " ")}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Clock size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Duration</span>
            </div>
            <p className="text-sm font-medium text-slate-200">
              {selectedLog.totalDays} day{selectedLog.totalDays > 1 ? 's' : ''} ({selectedLog.durationType?.replace(/_/g, " ")})
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1 sm:col-span-2">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Calendar size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Dates</span>
            </div>
            <p className="text-sm font-medium text-slate-200">
              {format(new Date(selectedLog.startDate), "MMM d, yyyy")} - {format(new Date(selectedLog.endDate), "MMM d, yyyy")}
            </p>
          </div>
          
          {selectedLog.emergencyContact && (
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1 sm:col-span-2">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Phone size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Emergency Contact</span>
              </div>
              <p className="text-sm font-medium text-slate-200">
                {selectedLog.emergencyContact.name} ({selectedLog.emergencyContact.phone})
              </p>
            </div>
          )}
        </div>

        {/* Reason Section */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <FileText size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Reason for Leave</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {selectedLog.reason}
          </p>
        </div>

        {/* Admin Message Display (if already decided) */}
        {!isPending && selectedLog.adminMessage && (
          <div className={`p-4 rounded-xl border ${selectedLog.status === 'APPROVED' ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-red-500/5 border-red-500/10'}`}>
            <div className={`flex items-center gap-2 mb-2 ${selectedLog.status === 'APPROVED' ? 'text-emerald-400' : 'text-red-400'}`}>
              <AlertCircle size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Admin Remark</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {selectedLog.adminMessage}
            </p>
          </div>
        )}

        {/* Admin Decision Section */}
        {isPending && (
          <div className="space-y-4 pt-4 border-t border-white/[0.06]">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block">
                Admin Remarks (Required for Rejection)
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter reason for rejection or notes for approval..."
                className="w-full h-24 p-3 rounded-xl border border-white/10 bg-black/20 text-sm text-slate-200 focus:border-accent/40 focus:ring-1 focus:ring-accent/40 outline-none resize-none transition-all placeholder:text-slate-600"
              />
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
                onClick={() => handleDecision("REJECTED")}
                disabled={loading || !remarks.trim()}
                isLoading={loading && decision === "REJECTED"}
              >
                <span className="flex items-center justify-center gap-2">
                  <XCircle size={16} />
                  Reject Request
                </span>
              </Button>
              <Button
                variant="primary"
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                onClick={() => handleDecision("APPROVED")}
                disabled={loading}
                isLoading={loading && decision === "APPROVED"}
              >
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} />
                  Approve Request
                </span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  );
};
