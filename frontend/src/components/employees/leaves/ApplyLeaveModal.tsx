"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import BaseModal from "@/components/ui/BaseModal";
import FormInput from "@/components/ui/FormInput";
import FormDropdown from "@/components/ui/FormDropdown";
import Button from "@/components/ui/Button";
import { LeaveDurationType, LeaveBalance } from "@/types/leave.types";
import { toast } from "sonner";
import { applyLeaveAction } from "@/actions/employee/leave.actions";

interface BookedLeavePeriod {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  availableLeaveTypes: string[];
  balances: LeaveBalance[];
  bookedLeaves?: BookedLeavePeriod[];
}

interface FormErrors {
  leaveType?: string;
  otherLeaveType?: string;
  startDate?: string;
  endDate?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  reason?: string;
}

const validatePhoneNumber = (phone: string): boolean => {
  const numericRegex = /^\d{10}$/;
  if (!numericRegex.test(phone)) return false;
  if (/^0{10}$/.test(phone)) return false;
  return true;
};

export const ApplyLeaveModal: React.FC<ApplyLeaveModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  availableLeaveTypes,
  balances,
  bookedLeaves = [],
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    leaveType: "",
    otherLeaveType: "",
    startDate: "",
    endDate: "",
    durationType: LeaveDurationType.FULL_DAY,
    reason: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const todayStr = useMemo(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }, []);

  const dynamicLeaveTypes = useMemo(() => {
    if (balances && balances.length > 0) {
      return balances.map((b) => b.leaveType);
    }
    return availableLeaveTypes;
  }, [balances, availableLeaveTypes]);

  const leaveTypeOptions = useMemo(() => {
    const types = dynamicLeaveTypes.map((type) => ({
      label: type.replace(/_/g, " "),
      value: type,
    }));
    return [
      { label: "Select Leave Type...", value: "", disabled: true },
      ...types,
      { label: "Other", value: "OTHER" },
    ];
  }, [dynamicLeaveTypes]);

  const durationOptions = [
    { label: "Full Day", value: LeaveDurationType.FULL_DAY },
  ];

  useEffect(() => {
    if (isOpen) {
      setFormData({
        leaveType: "",
        otherLeaveType: "",
        startDate: "",
        endDate: "",
        durationType: LeaveDurationType.FULL_DAY,
        reason: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
      });
      setErrors({});
      setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [isOpen]);

  const currentBalance = useMemo(() => {
    if (!formData.leaveType) return null;
    return balances.find((b) => b.leaveType === formData.leaveType);
  }, [balances, formData.leaveType]);

  const calculateTotalDays = (): number => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (start > end) return 0;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const totalDaysRequested = calculateTotalDays();

  useEffect(() => {
    const newErrors: FormErrors = {};

    if (formData.startDate) {
      if (formData.startDate < todayStr) {
        newErrors.startDate = "Start date cannot be a past date.";
      }
    }

    if (formData.endDate) {
      if (formData.endDate < todayStr) {
        newErrors.endDate = "End date cannot be a past date.";
      }
      if (formData.startDate && formData.endDate < formData.startDate) {
        newErrors.endDate = "End date cannot be earlier than the start date.";
      }
    }

    if (formData.startDate && !newErrors.startDate) {
      const rangeEnd = formData.endDate && !newErrors.endDate
        ? formData.endDate
        : formData.startDate; // treat as single-day when endDate not yet set

      const startReq = new Date(formData.startDate);
      const endReq = new Date(rangeEnd);

      const conflictingLeave = bookedLeaves.find((leave) => {
        const existingStart = new Date(leave.startDate);
        const existingEnd = new Date(leave.endDate);
        return startReq <= existingEnd && endReq >= existingStart;
      });

      if (conflictingLeave) {
        const msg = "You already have a leave request for this date — only one leave per day is allowed.";
        newErrors.startDate = msg;
        if (formData.endDate && !newErrors.endDate) {
          newErrors.endDate = "Dates conflict with an existing leave request.";
        }
      }
    }

    if (formData.emergencyContactPhone) {
      if (!validatePhoneNumber(formData.emergencyContactPhone)) {
        newErrors.emergencyContactPhone = "Must be a valid 10-digit number (cannot be all 0s).";
      }
    }

    setErrors(newErrors);
  }, [formData.startDate, formData.endDate, formData.emergencyContactPhone, todayStr, bookedLeaves]);

  const balanceValidation = useMemo<{
    status: "ok" | "warning" | "exceeded" | "blocked";
    message: string;
  }>(() => {
    if (!formData.leaveType || !currentBalance || formData.leaveType === "OTHER")
      return { status: "ok", message: "" };
    
    const { available, allocated, consumed, pending } = currentBalance;
    const leaveLabel = formData.leaveType.replace(/_/g, " ");
    
    if (allocated === 0)
      return {
        status: "blocked",
        message: `No "${leaveLabel}" leaves allocated under current company policy.`,
      };
    if (available <= 0)
      return {
        status: "blocked",
        message: `You have used all your "${leaveLabel}" quota (${consumed} consumed + ${pending} pending of ${allocated} allocated).`,
      };
    if (totalDaysRequested > available)
      return {
        status: "exceeded",
        message: `Requesting ${totalDaysRequested} day(s) exceeds your available "${leaveLabel}" balance of ${available} day(s).`,
      };
    if (available - totalDaysRequested <= 1 && totalDaysRequested > 0)
      return {
        status: "warning",
        message: `After this request you will have ${Math.max(0, available - totalDaysRequested).toFixed(1)} "${leaveLabel}" day(s) remaining.`,
      };
    return { status: "ok", message: "" };
  }, [currentBalance, totalDaysRequested, formData.leaveType]);

  const isBlocked =
    balanceValidation.status === "blocked" ||
    balanceValidation.status === "exceeded" ||
    Object.keys(errors).length > 0;

  const usagePercent =
    currentBalance && currentBalance.allocated > 0
      ? Math.min(100, Math.round(((currentBalance.consumed + currentBalance.pending) / currentBalance.allocated) * 100))
      : 0;

  const projectedPercent =
    currentBalance && currentBalance.allocated > 0
      ? Math.min(100, Math.round(((currentBalance.consumed + currentBalance.pending + totalDaysRequested) / currentBalance.allocated) * 100))
      : 0;

  const handleDropdownChange = (field: keyof typeof formData) => (e: any) => {
    const val = e?.target ? e.target.value : e;
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanedValue = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({ ...prev, emergencyContactPhone: cleanedValue }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.leaveType) {
      setErrors(prev => ({ ...prev, leaveType: "Please select a leave type" }));
      return;
    }
    if (!formData.startDate) {
      setErrors(prev => ({ ...prev, startDate: "Start date is required" }));
      return;
    }
    if (!formData.endDate) {
      setErrors(prev => ({ ...prev, endDate: "End date is required" }));
      return;
    }
    if (Object.keys(errors).length > 0) {
      toast.error("Please correct the validation errors below.");
      return;
    }
    if (isBlocked) {
      toast.error(balanceValidation.message || "Action blocked by policy limit constraints.");
      return;
    }
    if (!formData.emergencyContactName.trim()) {
      setErrors(prev => ({ ...prev, emergencyContactName: "Contact name is required" }));
      return;
    }
    if (!formData.reason.trim()) {
      setErrors(prev => ({ ...prev, reason: "Reason is required" }));
      return;
    }

    const finalLeaveType =
      formData.leaveType === "OTHER" && formData.otherLeaveType.trim()
        ? formData.otherLeaveType.trim()
        : formData.leaveType;

    setLoading(true);
    const submissionData = new FormData();
    submissionData.append("leaveType", finalLeaveType);
    submissionData.append("startDate", formData.startDate);
    submissionData.append("endDate", formData.endDate);
    submissionData.append("durationType", formData.durationType);
    submissionData.append("totalDays", String(totalDaysRequested));
    submissionData.append("reason", formData.reason);
    submissionData.append("emergencyContactName", formData.emergencyContactName);
    submissionData.append("emergencyContactPhone", formData.emergencyContactPhone);
    selectedFiles.forEach((file) => submissionData.append("attachments", file));

    const result = await applyLeaveAction(submissionData);

    if (result.success) {
      toast.success("Leave request submitted successfully");
      onSuccess();
      onClose();
    } else {
      toast.error(result.error ?? "Failed to submit leave request");
    }
    setLoading(false);
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Apply for Leave" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Live Balance Preview Panel */}
        {currentBalance && (
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                {formData.leaveType.replace(/_/g, " ")} — Policy Balance
              </span>
              <span className="text-[10px] text-slate-500">
                Policy Limit: <strong className="text-slate-300">{currentBalance.allocated} days</strong>
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { label: "Allocated", value: currentBalance.allocated, colorClass: "text-slate-200" },
                { label: "Consumed",  value: currentBalance.consumed,  colorClass: "text-orange-400" },
                { label: "Pending",   value: currentBalance.pending,   colorClass: "text-amber-400" },
                {
                  label: "Available",
                  value: currentBalance.available,
                  colorClass:
                    currentBalance.available <= 0
                      ? "text-red-400"
                      : currentBalance.available <= 2
                      ? "text-yellow-400"
                      : "text-emerald-400",
                },
              ].map((s) => (
                <div key={s.label} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col items-center gap-0.5">
                  <span className={`text-xl font-black leading-none ${s.colorClass}`}>{s.value}</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600">{s.label}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Usage</span>
                <span>
                  {usagePercent}% used
                  {totalDaysRequested > 0 && ` → ${projectedPercent}% after this request`}
                </span>
              </div>
              <div className="h-2.5 w-full bg-white/[0.05] rounded-full overflow-hidden relative">
                <div
                  className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
                  style={{ width: `${usagePercent}%`, background: usagePercent >= 100 ? "#ef4444" : "#f97316" }}
                />
                {totalDaysRequested > 0 && projectedPercent > usagePercent && (
                  <div
                    className="absolute top-0 h-full rounded-full transition-all duration-500"
                    style={{
                      left: `${usagePercent}%`,
                      width: `${Math.min(projectedPercent - usagePercent, 100 - usagePercent)}%`,
                      background: balanceValidation.status === "exceeded" ? "rgba(239,68,68,0.85)" : "rgba(251,191,36,0.85)",
                    }}
                  />
                )}
              </div>
              {totalDaysRequested > 0 && !errors.startDate && !errors.endDate && (
                <p className="text-[10px] text-slate-500">
                  Requesting <strong className="text-slate-200">{totalDaysRequested} day(s)</strong>
                  {" · "}Remaining after approval:{" "}
                  <strong
                    className={
                      Math.max(0, currentBalance.available - totalDaysRequested) <= 0
                        ? "text-red-400"
                        : Math.max(0, currentBalance.available - totalDaysRequested) <= 2
                        ? "text-yellow-400"
                        : "text-emerald-400"
                    }
                  >
                    {Math.max(0, currentBalance.available - totalDaysRequested).toFixed(1)} day(s)
                  </strong>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Balance Warning Banner */}
        {balanceValidation.message && (balanceValidation.status === "blocked" || balanceValidation.status === "exceeded") && (
          <div className="flex items-start gap-3 px-4 py-3 rounded-xl border text-[13px] font-medium bg-red-500/10 border-red-500/30 text-red-400">
            <span className="mt-0.5 shrink-0 text-base leading-none">🚫</span>
            {balanceValidation.message}
          </div>
        )}

        {/* Form Fields Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormDropdown
              label="Leave Type"
              name="leaveType"
              options={leaveTypeOptions}
              value={formData.leaveType}
              onChange={handleDropdownChange("leaveType")}
              required
              variant="company"
            />
            {errors.leaveType && <p className="text-xs text-red-400 mt-1 ml-1">{errors.leaveType}</p>}
            
            {formData.leaveType === "OTHER" && (
              <div className="mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                <FormInput
                  label="Specify Leave Type"
                  name="otherLeaveType"
                  type="text"
                  placeholder="E.g. Study Leave"
                  value={formData.otherLeaveType}
                  onChange={(e: any) => setFormData({ ...formData, otherLeaveType: e.target.value })}
                  required
                />
              </div>
            )}
          </div>

          <div>
            <FormDropdown
              label="Duration"
              name="durationType"
              options={durationOptions}
              value={formData.durationType}
              onChange={handleDropdownChange("durationType")}
              required
              variant="company"
            />
          </div>

          <div>
            <FormInput
              label="Start Date"
              name="startDate"
              type="date"
              min={todayStr}
              value={formData.startDate}
              onChange={(e: any) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
            {errors.startDate && <p className="text-xs text-red-400 mt-1 ml-1">{errors.startDate}</p>}
          </div>

          <div>
            <FormInput
              label="End Date"
              name="endDate"
              type="date"
              min={formData.startDate || todayStr}
              value={formData.endDate}
              onChange={(e: any) => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
            {errors.endDate && <p className="text-xs text-red-400 mt-1 ml-1">{errors.endDate}</p>}
          </div>

          {/* Booked Leave Dates Info Banner */}
          {bookedLeaves.length > 0 && (
            <div className="col-span-full flex items-start gap-2.5 px-3 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 animate-in fade-in duration-200">
              <span className="text-amber-400 mt-0.5 text-sm shrink-0">📅</span>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-1.5">
                  Already Booked — One Leave Per Day Is Allowed
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {bookedLeaves.map((leave, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 border border-amber-500/25 text-amber-300"
                    >
                      {leave.startDate === leave.endDate
                        ? leave.startDate
                        : `${leave.startDate} → ${leave.endDate}`}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div>
            <FormInput
              label="Emergency Contact Name"
              name="emergencyContactName"
              type="text"
              placeholder="Name of contact person"
              value={formData.emergencyContactName}
              onChange={(e: any) => setFormData({ ...formData, emergencyContactName: e.target.value })}
              required
            />
            {errors.emergencyContactName && <p className="text-xs text-red-400 mt-1 ml-1">{errors.emergencyContactName}</p>}
          </div>

          <div>
            <FormInput
              label="Emergency Contact Phone"
              name="emergencyContactPhone"
              type="text"
              placeholder="10 digit phone number"
              value={formData.emergencyContactPhone}
              onChange={handlePhoneChange}
              maxLength={10}
              required
            />
            {errors.emergencyContactPhone && <p className="text-xs text-red-400 mt-1 ml-1">{errors.emergencyContactPhone}</p>}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] ml-1 mb-2">
            Reason for Leave <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full px-4 py-3 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none bg-white/5 text-sm text-slate-200 placeholder-slate-500"
            rows={3}
            placeholder="Please provide a brief description..."
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            required
          />
          {errors.reason && <p className="text-xs text-red-400 mt-1 ml-1">{errors.reason}</p>}
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] ml-1 mb-2">
            Attachments (Optional)
          </label>
          <div className="flex flex-col gap-2 p-4 border border-dashed border-slate-200/40 rounded-xl bg-white/5">
            <input
              type="file"
              name="attachments"
              multiple
              onChange={handleFileChange}
              ref={fileInputRef}
              className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500/20 transition-all cursor-pointer"
            />
            {selectedFiles.length > 0 && (
              <div className="text-xs text-slate-400 mt-1 font-medium">
                Selected: {selectedFiles.map((f) => f.name).join(", ")}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-t-white/[0.05]">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={loading}
            disabled={isBlocked || loading}
            title={isBlocked ? "Please fix form errors before submitting." : undefined}
          >
            Submit Request
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};