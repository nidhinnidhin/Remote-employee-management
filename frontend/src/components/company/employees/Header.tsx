"use client";

import { Filter, UserPlus, Users } from "lucide-react";
import React, { useState } from "react";
import EmployeeStats from "./EmployeeStats";
import Button from "../../ui/Button";
import InviteEmployeeModal from "../modals/InviteEmployeeModal";
import { InviteEmployeePayload } from "@/shared/types/company/employees/auth/invite-employee-payload.type";
import { toast } from "sonner";
import { clientApi } from "@/lib/axios/axiosClient";

const Header = () => {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInvite = async (data: InviteEmployeePayload) => {
    try {
      setLoading(true);

      await clientApi.post("/company/employees/invite", data);

      setIsInviteOpen(false);
      toast.success("Invitation sent successfully"); // ✅ optional: toast success
      console.log("Invitation sent successfully");
    } catch (error: any) {
      console.error("Invite failed", error);
      const errorMessage = error.response?.data?.message || "Failed to send invitation";
      toast.error(errorMessage); // ❌ optional: toast error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-pink-500 mb-1">Employees</h1>
          <p className="text-gray-500">Manage your team members</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors font-medium">
            <Users size={18} />
            <span>Bulk Invite</span>
          </button>

          <Button
            variant="primary"
            className="flex items-center gap-2"
            onClick={() => setIsInviteOpen(true)}
            disabled={loading}
          >
            <UserPlus size={18} />
            <span>{loading ? "Sending..." : "Add Employee"}</span>
          </Button>
        </div>
      </div>

      <EmployeeStats />

      <InviteEmployeeModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onInvite={handleInvite}
      />
    </div>
  );
};

export default Header;
