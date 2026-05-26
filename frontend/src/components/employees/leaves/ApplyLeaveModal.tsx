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
    durationType: LeaveDurationType.FULL_DAY,
    reason: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });

  // Extract names from balance array. Fallback to availableLeaveTypes if empty.
  const dynamicLeaveTypes = useMemo(() => {
    if (balances && balances.length > 0) {
      return balances.map((b) => b.leaveType);
    }
    return availableLeaveTypes;
  }, [balances, availableLeaveTypes]);

  // Construct options for dropdown dynamically. Fallback literal string 'OTHER' replaces old strict enum.
  const leaveTypeOptions = useMemo(() => {
    const types = dynamicLeaveTypes.map((type) => ({
      label: type.replace(/_/g, " "),
      value: type,
    }));

    return [...types, { label: "Other", value: "OTHER" }];
  }, [dynamicLeaveTypes]);

  // Set default selection when modal opens
  useEffect(() => {
    if (isOpen && dynamicLeaveTypes.length > 0 && !formData.leaveType) {
      setFormData((prev) => ({ ...prev, leaveType: dynamicLeaveTypes[0] }));
    }
  }, [isOpen, dynamicLeaveTypes, formData.leaveType]);

  const durationOptions = [
    { label: "Full Day", value: LeaveDurationType.FULL_DAY },
    { label: "First Half", value: LeaveDurationType.FIRST_HALF },
    { label: "Second Half", value: LeaveDurationType.SECOND_HALF },
  ];

  const handleDropdownChange =
    (field: keyof typeof formData) =>
    (e: { target: { name: string; value: string } }) => {
      setFormData({ ...formData, [field]: e.target.value });
    };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  // Helper to dynamically calculate total leave days requested
  const calculateTotalDays = (): number => {
    if (!formData.startDate || !formData.endDate) return 1;
    if (formData.durationType !== LeaveDurationType.FULL_DAY) return 0.5;

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return isNaN(diffDays) ? 1 : diffDays;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.startDate || !formData.endDate) {
      toast.error("Start and end dates are required");
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast.error("End date cannot be before start date");
      return;
    }

    if (!formData.reason.trim()) {
      toast.error("Reason is required");
      return;
    }

    if (
      !formData.emergencyContactName.trim() ||
      !formData.emergencyContactPhone.trim()
    ) {
      toast.error("Emergency contact details are required");
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

    // Construct native FormData transport map to safely clear Server Action boundaries
    const submissionData = new FormData();
    submissionData.append("leaveType", finalLeaveType);
    submissionData.append("startDate", formData.startDate);
    submissionData.append("endDate", formData.endDate);
    submissionData.append("durationType", formData.durationType);
    submissionData.append("totalDays", String(calculateTotalDays()));
    submissionData.append("reason", formData.reason);
    submissionData.append(
      "emergencyContactName",
      formData.emergencyContactName,
    );
    submissionData.append(
      "emergencyContactPhone",
      formData.emergencyContactPhone,
    );

    // Append binary file objects to array track keys
    selectedFiles.forEach((file) => {
      submissionData.append("attachments", file);
    });

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
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Apply for Leave"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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
                  onChange={(e) =>
                    setFormData({ ...formData, otherLeaveType: e.target.value })
                  }
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
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            required
          />

          <FormInput
            label="End Date"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
            required
          />

          <FormInput
            label="Emergency Contact Name"
            name="emergencyContactName"
            type="text"
            placeholder="Name of contact person"
            value={formData.emergencyContactName}
            onChange={(e) =>
              setFormData({ ...formData, emergencyContactName: e.target.value })
            }
            required
          />

          <FormInput
            label="Emergency Contact Phone"
            name="emergencyContactPhone"
            type="tel"
            placeholder="Phone number"
            value={formData.emergencyContactPhone}
            onChange={(e) =>
              setFormData({
                ...formData,
                emergencyContactPhone: e.target.value,
              })
            }
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
            onChange={(e) =>
              setFormData({ ...formData, reason: e.target.value })
            }
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
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={loading}>
            Submit Request
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};
