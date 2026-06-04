"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import BaseModal from "@/components/ui/BaseModal";
import FormInput from "@/components/ui/FormInput";
import FormDropdown from "@/components/ui/FormDropdown";
import Button from "@/components/ui/Button";
import { LeaveDurationType, LeaveBalance } from "@/types/leave.types";
import { toast } from "sonner";
import { applyLeaveAction } from "@/actions/employee/leave.actions";

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  availableLeaveTypes: string[];
  balances: LeaveBalance[];
}

export const ApplyLeaveModal: React.FC<ApplyLeaveModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  availableLeaveTypes,
  balances,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    leaveType: "",
    otherLeaveType: "",
    startDate: "",
    endDate: "",
    durationType: LeaveDurationType.FULL_DAY as LeaveDurationType,
    reason: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });

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
    return [...types, { label: "Other", value: "OTHER" }];
  }, [dynamicLeaveTypes]);

  useEffect(() => {
    if (isOpen && dynamicLeaveTypes.length > 0 && !formData.leaveType) {
      setFormData((prev) => ({ ...prev, leaveType: dynamicLeaveTypes[0] }));
    }
  }, [isOpen, dynamicLeaveTypes, formData.leaveType]);

  const currentBalance = useMemo(() => {
    return balances.find((b) => b.leaveType === formData.leaveType);
  }, [balances, formData.leaveType]);

  const durationOptions = [
    { label: "Full Day", value: LeaveDurationType.FULL_DAY },
    { label: "First Half", value: LeaveDurationType.FIRST_HALF },
    { label: "Second Half", value: LeaveDurationType.SECOND_HALF },
  ];

  const calculateTotalDays = (): number => {
    if (!formData.startDate || !formData.endDate) return 0;
    if (formData.durationType !== LeaveDurationType.FULL_DAY) return 0.5;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return isNaN(diffDays) ? 0 : diffDays;
  };

  const totalDaysRequested = calculateTotalDays();

  // Policy-based validation using allocated/available from LeaveBalance
  const balanceValidation = useMemo<{
    status: "ok" | "warning" | "exceeded" | "blocked";
    message: string;
  }>(() => {
    if (!currentBalance || formData.leaveType === "OTHER")
      return { status: "ok", message: "" };
    const { available, allocated, consumed, pending } = currentBalance;
    const leaveLabel = formData.leaveType.replace(/_/g, " ");
    if (allocated === 0)
      return {
        status: "blocked",
        message: `No "${leaveLabel}" leaves allocated under the current company policy.`,
      };
    if (available <= 0)
      return {
        status: "blocked",
        message: `You have used all your "${leaveLabel}" quota (${consumed} consumed + ${pending} pending of ${allocated} allocated).`,
      };
    if (totalDaysRequested > available)
      return {
        status: "exceeded",
        message: `Requesting ${totalDaysRequested} day(s) exceeds your available "${leaveLabel}" balance of ${available} day(s). Company policy limit: ${allocated} days.`,
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
    balanceValidation.status === "exceeded";

  const usagePercent =
    currentBalance && currentBalance.allocated > 0
      ? Math.min(
          100,
          Math.round(
            ((currentBalance.consumed + currentBalance.pending) /
              currentBalance.allocated) *
              100
          )
        )
      : 0;

  const projectedPercent =
    currentBalance && currentBalance.allocated > 0
      ? Math.min(
          100,
          Math.round(
            ((currentBalance.consumed + currentBalance.pending + totalDaysRequested) /
              currentBalance.allocated) *
              100
          )
        )
      : 0;

  // Resolved possible type mismatch signature for form events
  const handleDropdownChange =
    (field: keyof typeof formData) =>
    (e: any) => {
      const val = e?.target ? e.target.value : e;
      setFormData((prev) => ({ ...prev, [field]: val }));
    };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isBlocked) {
      toast.error(balanceValidation.message || "Leave quota exceeded per company policy.");
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      toast.error("Start and end dates are required");
      return;
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast.error("End date cannot be before start date");
      return;
    }
    if (!formData.emergencyContactName.trim() || !formData.emergencyContactPhone.trim()) {
      toast.error("Emergency contact details are required");
      return;
    }
    if (!formData.reason.trim()) {
      toast.error("Reason is required");
      return;
    }

    const finalLeaveType =
      formData.leaveType === "OTHER" && formData.otherLeaveType.trim()
        ? formData.otherLeaveType.trim()
        : formData.leaveType;

    if (!finalLeaveType) {
      toast.error("Leave type is required");
      return;
    }

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
      setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setFormData({
        leaveType: dynamicLeaveTypes[0] ?? "",
        otherLeaveType: "",
        startDate: "",
        endDate: "",
        durationType: LeaveDurationType.FULL_DAY,
        reason: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
      });
    } else {
      toast.error(result.error ?? "Failed to submit leave request");
    }
    setLoading(false);
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Apply for Leave" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ── Live Balance Preview Panel ── */}
        {currentBalance && (
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                {formData.leaveType.replace(/_/g, " ")} — Policy Balance
              </span>
              <span className="text-[10px] text-slate-500">
                Policy Limit: <strong className="text-slate-300">{currentBalance.allocated} days</strong>
              </span>
            </div>

            {/* Stats row */}
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

            {/* Usage progress bar */}
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
              {totalDaysRequested > 0 && (
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

        {/* ── Validation Alert Banner ── */}
        {balanceValidation.message && (
          <div
            className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-[13px] font-medium ${
              isBlocked
                ? "bg-red-500/10 border-red-500/30 text-red-400"
                : "bg-amber-500/10 border-amber-500/30 text-amber-300"
            }`}
          >
            <span className="mt-0.5 shrink-0 text-base leading-none">{isBlocked ? "🚫" : "⚠️"}</span>
            {balanceValidation.message}
          </div>
        )}

        {/* Form Fields */}
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
            {formData.leaveType === "OTHER" && (
              <div className="mt-2">
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

          <FormDropdown
            label="Duration"
            name="durationType"
            options={durationOptions}
            value={formData.durationType}
            onChange={handleDropdownChange("durationType")}
            required
            variant="company"
          />

          <FormInput
            label="Start Date"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e: any) => setFormData({ ...formData, startDate: e.target.value })}
            required
          />

          <FormInput
            label="End Date"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e: any) => setFormData({ ...formData, endDate: e.target.value })}
            required
          />

          <FormInput
            label="Emergency Contact Name"
            name="emergencyContactName"
            type="text"
            placeholder="Name of contact person"
            value={formData.emergencyContactName}
            onChange={(e: any) => setFormData({ ...formData, emergencyContactName: e.target.value })}
            required
          />

          <FormInput
            label="Emergency Contact Phone"
            name="emergencyContactPhone"
            type="tel"
            placeholder="Phone number"
            value={formData.emergencyContactPhone}
            onChange={(e: any) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] ml-1 mb-2">
            Reason for Leave <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full px-4 py-3 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none bg-white/5 text-sm text-slate-200 placeholder-slate-500"
            rows={3}
            placeholder="Please provide a brief reason..."
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            required
          />
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
              <div className="text-xs text-slate-400 mt-1">
                Selected: {selectedFiles.map((f) => f.name).join(", ")}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100/10">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={loading}
            disabled={isBlocked || loading}
            title={isBlocked ? balanceValidation.message : undefined}
          >
            Submit Request
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};